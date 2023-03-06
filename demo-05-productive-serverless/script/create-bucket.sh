BUCKET_NAME=treinamento-aws-brspontes

aws \
  s3 mb s3://$BUCKET_NAME

aws \
  s3 ls

  #aws s3 mb s3://treinamento-brspontes --endpoint-url="http://localhost:4566"
  #aws s3 ls --endpoint-url="http://localhost:4566"