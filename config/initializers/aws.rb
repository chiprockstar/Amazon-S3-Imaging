Aws.config.update({
 region: 'us-east-1',
 credentials: Aws::Credentials.new('AKIAJNGMMW3LLR24NJ2A', '8JI0r1UTQ41Vg02EZMPyIbsF0YxKRv2tpUg7iXFj')
})

#Aws.config(access_key_id: 'AKIAJNGMMW3LLR24NJ2A', secret_access_key: '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', region: 'us-west-2')

S3_BUCKET = Aws::S3::Resource.new.bucket('bbr-development')
