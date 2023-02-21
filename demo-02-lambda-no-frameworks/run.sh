aws --version
ROLE_NAME=lambda-example
NODEJS_VERSION=nodejs16.x
FUNCTION_NAME=hello-cli

mkdir -p logs

aws iam create-role \
 --role-name $ROLE_NAME \
 --assume-role-policy-document file://policies.json \
 | tee logs/1.role.log

 POLICY_ARN="arn:aws:iam::448832873402:role/lambda-example"

 # linux => zip function.zip index.js
 #windows => tar.exe -a -c -f function.zip index.js

#tar.exe -a -c -f function.zip index.js

aws lambda create-function \
 --function-name $FUNCTION_NAME \
 --zip-file fileb://function.zip \
 --handler index.handler \
 --runtime $NODEJS_VERSION \
 --role $POLICY_ARN \
 | tee logs/2.role.log

 aws lambda create-function \
 --function-name hello-cli \
 --zip-file "fileb://function.zip" \
 --handler index.handler \
 --runtime nodejs18.x \
 --role "arn:aws:iam::448832873402:role/lambda-example" \
 | tee logs/2.role.log

 aws lambda create-function --function-name hello-cli --runtime nodejs18.x --role "arn:aws:iam::448832873402:role/lambda-example" --handler index.handler --zip-file fileb://index.zip

 aws lambda invoke \
  --function-name hello-cli logs/3.lambda.exec \
  --log-type Tail \
  --query 'LogResult' \
  --output text | base64 -d

  #update
  aws lambda update-function-code \
    --zip-file fileb://index.zip \
    --function-name hello-cli \
    --publish \
    | tee logs/4.update.log

  #remove
  aws lambda delete-function \
    --function-name hello-cli

  aws iam delete-role \
   --role-name lambda-example