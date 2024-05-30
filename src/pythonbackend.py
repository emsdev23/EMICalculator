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
   
   for _ in range(months):
       fifth_day = current_date.replace(day=5)
       dates.append(fifth_day)
       if current_date.month == 12:
           current_date = current_date.replace(year=current_date.year + 1, month=1)
       else:
           current_date = current_date.replace(month=current_date.month + 1)
   
   return dates

def emi_calculator(principal, rate, time):
   rate = rate / (12 * 100) # one month interest
   time = time * 12 # one month period
   emi = round((principal * rate * pow(1 + rate, time)) / (pow(1 + rate, time) - 1))
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
   time = math.log(emi / (emi - principal * rate), 1 + rate)  # rearranged EMI formula
   time = int(math.ceil(time))
   time_years = time / 12  # converting months to years
   return time, time_years

def getDates(startDate, years):
   start_date = datetime.strptime(startDate, '%Y-%m-%d')
   year, month = start_date.year, start_date.month
   # print(year,month,years)

   dates = []
   
   for y in range(year, year + years + 1):
       for m in range(1, 13):
           if y == year and m < month:
               continue
           date = datetime(y, m, 5)
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
       emi = data.get('emi')

       if time:
           time = time * 12

       elif emi:
           time, time_years = calculate_loan_tenure(principal, rate, emi)

       totalInterest = round(generate_amortization_schedule(principal,rate,time))
       totalInterestp = round((totalInterest/(totalInterest+principal))*100)
       principalp = round((principal/(totalInterest+principal))*100)
       TotalPayment=round((totalInterest+principal))
       
       emi_list.append({'totalInterest':totalInterest,'principal':principal,
                        'totalInterestp':totalInterestp,'principalp':principalp,"TotalPayment":TotalPayment})
   
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
       emi = data.get('emi')
       dateAmount = data.get('dateAmount')
       firstdate = data.get('firstdate')
       additional = data.get('additional')
       additionalone = data.get('additionalone')

       if time and dateAmount:
           emi = emi_calculator(principal, rate, time) 

           dateAmount[firstdate] = emi

           time, time_years = calculate_loan_tenure(principal, rate, emi)

           emiDates = getDatesMonth(firstdate,time)

           emi_list = calculate_emi_breakdown_with_dates(principal,rate,emiDates,dateAmount,additional=additional,additionalone=additionalone)



       elif time:
           emi = emi_calculator(principal, rate, time) 
           estDate = getDates(firstdate,time)
           
           monthly_rate = rate / (12 * 100) 
           outstanding_principal = principal

           if additionalone:
               additionalone = {datetime.strptime(date, '%Y-%m-%d'): amount for date, amount in additionalone.items()}


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

               if additionalone:
                   closest_payment_date = min(additionalone.keys(), key=lambda d: abs(d - i))
                   if abs(closest_payment_date - i) <= timedelta(days=30):
                       additional_payment = additionalone[closest_payment_date]
                       outstanding_principal -= additional_payment
                       dated = str(closest_payment_date)[0:10]
                       # Remove the used additional payment to avoid duplicate processing
                       del additionalone[closest_payment_date]

                       emi_list.append({'date':dated,'EMI':0,'additionalpayment':additional_payment,'principal':0,'interest':0,'balance':outstanding_principal})       

               if outstanding_principal <= 0:
                   break

       elif emi and dateAmount:
           dateAmount[firstdate] = emi

           time, time_years = calculate_loan_tenure(principal, rate, emi)

           emiDates = getDatesMonth(firstdate,time)

           emi_list = calculate_emi_breakdown_with_dates(principal,rate,emiDates,dateAmount,additional=additional,additionalone=additionalone)            

       elif emi:
           time, time_years = calculate_loan_tenure(principal, rate, emi)

           emiDates = getDatesMonth(firstdate,time)

           if additionalone:
               additionalone = {datetime.strptime(date, '%Y-%m-%d'): amount for date, amount in additionalone.items()}

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

               if additionalone:
                   closest_payment_date = min(additionalone.keys(), key=lambda d: abs(d - i))
                   if abs(closest_payment_date - i) <= timedelta(days=30):
                       additional_payment = additionalone[closest_payment_date]
                       outstanding_principal -= additional_payment
                       dated = str(closest_payment_date)[0:10]
                       # Remove the used additional payment to avoid duplicate processing
                       del additionalone[closest_payment_date]

                       emi_list.append({'date':dated,'EMI':0,'additionalpayment':additional_payment,'principal':0,'interest':0,'balance':outstanding_principal})
               
               if outstanding_principal <= 0:
                   break

   except mysql.connector.Error as e:
       return JSONResponse(content={"error": ["MySQL connection error",e]}, status_code=500)

   return emi_list

if __name__ == "__main__":
   import uvicorn

   uvicorn.run(app, host="0.0.0.0", port=3001)
