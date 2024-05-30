from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
import mysql.connector
from fastapi.responses import JSONResponse
import math
from datetime import datetime,timedelta
import json

app = FastAPI()

origins = [
   "*",
   # Add more origins as needed
]

app.add_middleware(
   CORSMiddleware,
   allow_origins=origins,
   allow_credentials=True,
   allow_methods=["*"],
   allow_headers=["*"],
)



def get_meterdb():
   db=mysql.connector.connect(
       host="121.242.232.211",
       user="emsroot",
       password="22@teneT",
       database='EMS',
       port=3306
   )
   return db

def getDatesMonth(startDate, months):
   start_date = datetime.strptime(startDate, '%Y-%m-%d')
   dates = []
   current_date = start_date
   year, month, dated = start_date.year, start_date.month, start_date.day
   
   for _ in range(months):
       fifth_day = current_date.replace(day=dated)
       dates.append(fifth_day)
       if current_date.month == 12:
           current_date = current_date.replace(year=current_date.year + 1, month=1)
       else:
           current_date = current_date.replace(month=current_date.month + 1)
   
   return dates

def emi_calculator(principal, annual_interest_rate, loan_term_years):

   monthly_interest_rate = annual_interest_rate / 12 / 100
   
   # Convert loan term in years to number of monthly installments
   number_of_installments = loan_term_years * 12
   
   # Calculate EMI using the formula
   emi = (principal * monthly_interest_rate * (1 + monthly_interest_rate) ** number_of_installments) / \
         ((1 + monthly_interest_rate) ** number_of_installments - 1)
   
   return emi

def generate_amortization_schedule(principal, annual_rate, months):
   monthly_rate = annual_rate / 12 / 100
   num_payments = months 
   
   remaining_principal = principal
   total_interest_paid = 0
   
   for i in range(1, num_payments + 1):
       interest_payment = remaining_principal * monthly_rate
       total_interest_paid += interest_payment
       
   return total_interest_paid

def calculate_loan_tenure(principal, rate, emi):
   rate = rate / 12 / 100  # converting annual rate to monthly and then to fraction
   try:
       time = math.log(emi / (emi - principal * rate), 1 + rate)  # rearranged EMI formula
   except Exception as ex:
       print(ex)
       return "Lower EMI","no years"
   time = int(math.ceil(time))
   time_years = time / 12  # converting months to years
   return time, time_years

def getDates(startDate, years):
   start_date = datetime.strptime(startDate, '%Y-%m-%d')
   year, month, dated = start_date.year, start_date.month, start_date.day
   # print(year,month,years)

   years = round(years)

   dates = []
   
   for y in range(year, year + years + 1):
       for m in range(1, 13):
           if y == year and m < month:
               continue
           date = datetime(y, m, dated)
           dates.append(date)
   
   return dates


def calculate_emi_breakdown_with_dates(principal: float, rate: float, emiDates: list, dateAmount: dict, additional = 0, additionalone = None):
   monthly_rate = rate / (12 * 100)  # One month interest
   outstanding_principal = principal
   emi_list = []

   dateAmountli = sorted(dateAmount.keys())

   if additional == None:
       additional = 0

   if additionalone:
       additionalone = {datetime.strptime(date, '%Y-%m-%d'): amount for date, amount in additionalone.items()}

   for i in emiDates:
       if outstanding_principal <= 0:
           break

       outstanding_principal = outstanding_principal - additional
       interest = round(outstanding_principal * monthly_rate)
       datd = str(i)[0:10]
       Dated = datetime.strptime(datd, '%Y-%m-%d')

       closest_date = None
       for j in dateAmountli:
           Date = datetime.strptime(j, '%Y-%m-%d')
           if Dated >= Date:
               closest_date = j
           else:
               break

       if closest_date:
           emi = dateAmount[closest_date]
           principal_component = round(emi - interest)
           outstanding_principal -= round(principal_component)


           emi_list.append({
                   'date': str(i)[0:10],
                   'EMI': emi,
                   'additionalpayment':additional,
                   'principal': principal_component,
                   'interest': interest,
                   'balance': outstanding_principal
               })
       
       if additionalone:
           closest_payment_date = min(additionalone.keys(), key=lambda d: abs(d - i))
           if abs(closest_payment_date - i) <= timedelta(days=30):
               additional_payment = additionalone[closest_payment_date]
               outstanding_principal -= additional_payment
               # Remove the used additional payment to avoid duplicate processing
               del additionalone[closest_payment_date]

               dated = str(closest_payment_date)[0:10]

               emi_list.append({
                   'date': dated,
                   'EMI': 0,
                   'additionalpayment':additional_payment,
                   'principal': 0,
                   'interest': 0,
                   'balance': outstanding_principal
               })

   return emi_list


@app.post('/emi/overall')
def peak_demand_date(data: dict, db: mysql.connector.connect = Depends(get_meterdb)):
   emi_list = []

   try:
       principal = data.get('principal')
       rate = data.get('rate')
       time = data.get('year')
       firstdate = data.get('firstdate')
       dateAmount = data.get('dateAmount')
       additional = data.get('additional')
       additionalOT = data.get('additionalone')
   
       additionalot = []
       additionalone = {}

       outstanding_principal = principal

       for i in additionalOT:
           if i["date"] != None:
               additionalot.append(i)

       if firstdate:

           if time:
               emi = emi_calculator(principal, rate, time)
               monthly_rate = rate / (12 * 100) 

               estDate = getDates(firstdate,time)

           elif dateAmount and (time == 0 or time == None):
               print(dateAmount)
               emi = next(iter(dateAmount.values()))
               time, time_years = calculate_loan_tenure(principal, rate, emi)
               monthly_rate = rate / (12 * 100) 
               interest = round(principal * monthly_rate)

               estDate = getDatesMonth(firstdate,time)
               
               if time == "Lower EMI":
                   print({"lessEmi":interest})

                   return {"lessEmi":interest}
               
           totalInterest = 0
           
           for i in estDate:
               interest = round(outstanding_principal * monthly_rate)
               principal_component = round(emi - interest)
               outstanding_principal -= round(principal_component)

               totalInterest += interest

               if len(additionalot) > 0:
                   additionalone = {item["date"]: item["amount"] for item in additionalot}
                   additionalone = {datetime.strptime(date, '%Y-%m-%d'): amount for date, amount in additionalone.items()}

                   closest_payment_date = min(additionalone.keys(), key=lambda d: abs(d - i))
                   if abs(closest_payment_date - i) <= timedelta(days=30):
                       additional_payment = additionalone[closest_payment_date]
                       outstanding_principal -= additional_payment
                       dated = str(closest_payment_date)[0:10]
                       # Remove the used additional payment to avoid duplicate processing
                       del additionalone[closest_payment_date]

               if outstanding_principal < 0:
                   break
           
           totalInterestp = round((totalInterest/(totalInterest+principal))*100)
           principalp = round((principal/(totalInterest+principal))*100)
           total = totalInterest+principal
           
           emi_list.append({'totalInterest':totalInterest,'principal':principal,"checkValue":interest,
                           'totalInterestp':totalInterestp,'principalp':principalp,"emi":round(emi),'TotalPayment':total})
   
   except mysql.connector.Error as e:
       return JSONResponse(content={"error": ["MySQL connection error",e]}, status_code=500)

   return emi_list

@app.post('/emi/CalcEMI')
def peak_demand_date(data: dict, db: mysql.connector.connect = Depends(get_meterdb)):
   emi_list = []

   try:
       principal = data.get('principal')
       rate = data.get('rate')
       time = data.get('year')
       dateAmount = data.get('dateAmount')
       firstdate = data.get('firstdate')
       additional = data.get('additional')
       additionalOT = data.get('additionalone')
   
       additionalot = []
       additionalone = {}

       for i in additionalOT:
           if i["date"] != None:
               additionalot.append(i)
   
       
       value_is_not_none = any(value is not None for value in dateAmount.values())

       print(dateAmount)

       if firstdate in dateAmount.keys() and value_is_not_none:
           time = 0

       if firstdate:
           if time != 0 and time != None and value_is_not_none:
               emi = emi_calculator(principal, rate, time) 

               value_is_none = any(value is None for value in dateAmount.values())
           
               dateAmount[firstdate] = emi

               monthly_rate = rate / (12 * 100) 
               interest = round(principal * monthly_rate)

               values_less_than_interest = [value for value in dateAmount.values() if value < interest]

               if values_less_than_interest:
                   print({"lessEmi":interest})

                   return {"lessEmi":interest}
               
               if len(additionalot) > 0:
                   additionalone = {item["date"]: item["amount"] for item in additionalot}
               
               time, time_years = calculate_loan_tenure(principal, rate, emi)

               emiDates = getDatesMonth(firstdate,time)

               emi_list = calculate_emi_breakdown_with_dates(principal,rate,emiDates,dateAmount,additional=additional,additionalone=additionalone)


           elif value_is_not_none:
               emi = next(iter(dateAmount.values()))
               time, time_years = calculate_loan_tenure(principal, rate, emi)

               print(time)

               if time != "Lower EMI":
                   emiDates = getDatesMonth(firstdate,time)
               else:
                   monthly_rate = rate / (12 * 100)
                   interest = round(principal * monthly_rate)

                   return {"lessEmi":interest}

               
               monthly_rate = rate / (12 * 100)  # One month interest
               outstanding_principal = principal
               for i in emiDates:
                   if additional:
                       outstanding_principal = outstanding_principal - additional
                   else:
                       additional = 0

                   interest = round(outstanding_principal * monthly_rate)
                   principal_component = round(emi - interest)
                   outstanding_principal -= round(principal_component)

                   emi_list.append({'date':str(i)[0:10],'EMI':emi,'additionalpayment':additional,'principal':principal_component,'interest':interest,'balance':outstanding_principal})

                   if len(additionalot) > 0:
                       additionalone = {item["date"]: item["amount"] for item in additionalot}
                       additionalone = {datetime.strptime(date, '%Y-%m-%d'): amount for date, amount in additionalone.items()}

                       for j in additionalone:

                           if (i - j).days <= 0 and (i - j).days >= -30:
                               print(j)
                               additional_payment = additionalone[j]
                               outstanding_principal -= additional_payment
                               dated = str(j)[0:10]
                               # Remove the used additional payment to avoid duplicate processing

                               emi_list.append({'date':dated,'EMI':0,'additionalpayment':additional_payment,'principal':0,'interest':0,'balance':outstanding_principal})
                   
                   if outstanding_principal <= 0:
                       break

           elif time:
               emi = emi_calculator(principal, rate, time) 
               estDate = getDates(firstdate,time)
               
               monthly_rate = rate / (12 * 100) 
               outstanding_principal = principal

               for i in estDate:
                   if additional:
                       outstanding_principal = outstanding_principal - additional
                   else:
                       additional = 0

                   interest = round(outstanding_principal * monthly_rate)
                   principal_component = round(emi - interest)
                   outstanding_principal -= round(principal_component)
                   
                   if outstanding_principal > 0:
                       emi_list.append({'date':str(i)[0:10],'EMI':emi,'additionalpayment':additional,'principal':principal_component,'interest':interest,'balance':outstanding_principal})

                   else:
                       emi_list.append({'date':str(i)[0:10],'EMI':emi,'additionalpayment':additional,'principal':principal_component,'interest':interest,'balance':outstanding_principal})
                       break 

                   if len(additionalot)>0:
                       additionalone = {item["date"]: item["amount"] for item in additionalot}
                       additionalone = {datetime.strptime(date, '%Y-%m-%d'): amount for date, amount in additionalone.items()}

                       for j in additionalone:

                           if (i - j).days <= 0 and (i - j).days >= -30:
                               print(j)
                               additional_payment = additionalone[j]
                               outstanding_principal -= additional_payment
                               dated = str(j)[0:10]
                               # Remove the used additional payment to avoid duplicate processing

                               emi_list.append({'date':dated,'EMI':0,'additionalpayment':additional_payment,'principal':0,'interest':0,'balance':outstanding_principal})       

                   if outstanding_principal <= 0:
                       break

   except mysql.connector.Error as e:
       return JSONResponse(content={"error": ["MySQL connection error",e]}, status_code=500)

   return emi_list

if __name__ == "__main__":
   import uvicorn

   uvicorn.run(app, host="0.0.0.0", port=3001)