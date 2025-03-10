# nist-compliance-ssh-banner
SSH banners on EC2 

This Terraform configuration implements SSH banners for EC2 instances to comply with NIST 800-171 requirements. The implementation uses AWS Systems Manager (SSM) to deploy and maintain the banner configuration across multiple instances.

<b>Features</b>

Deploys an SSM document that configures SSH banners on EC2 instances
Creates an SSM association to apply the banner to all instances in the specified environment
Sets up a custom AWS Config rule to verify compliance
Optionally creates a test EC2 instance for validation
Includes appropriate IAM roles and policies

<b>Prerequisites</b>

AWS account with appropriate permissions
Terraform 0.14 or later
AWS CLI configured
GitHub repository for storing this code
EC2 instances must have SSM Agent installed and appropriate IAM permissions

Setup Instructions

Clone this repository to local machine
Initialize Terraform
<code>terraform init</code>

<bb>Prepare the Lambda fx</b>
<code>mkdir -p lambda
cp index.js lambda/
cd lambda
npm init -y
npm install aws-sdk
zip -r ssh_banner_check.zip index.js node_modules
cd ..</code>

Terraform Apply

<b>Verify the implementation</b>

Connect to the test instance via SSH and verify the banner appears
Check the SSM association status in the AWS Management Console
View the AWS Config rule compliance status

<b>What it does</b>
The configuration creates an SSM document containing a shell script that:

Backs up the existing sshd_config file
Configures the SSH banner in sshd_config
Creates the banner file with the required text
Restarts the SSH service


An SSM association applies this document to all instances with the specified tags:

Environment tag matching the environment variable
Application tag matching the application_name variable


The association runs on a schedule to ensure ongoing compliance
A custom AWS Config rule checks if the banner is properly configured

<b>Customization</b>

Modify variables.tf to change default values
Edit the banner text in terraform.tfvars or when applying Terraform
Adjust the targeting logic in the SSM association to match your environment

Push to GH repo:
<code>git add .
git commit -m "Add SSH banner implementation for NIST 800-171 compliance"
git push</code>

<h3>Troubleshooting></h3>

SSM Association Failure: Verify the instances have the SSM agent installed and proper IAM permissions
Banner Not Appearing: Check the SSM command output and verify the sshd service restarted properly
Lambda Function Error: Check CloudWatch Logs for the Lambda function execution details

Security Considerations

The SSM document has access to modify system files, so ensure it's properly secured
Consider using AWS KMS to encrypt sensitive data
Review IAM permissions to ensure least privilege

Compliance Verification
After deployment, you can verify compliance using:

AWS Config:

Navigate to the AWS Config console
Check the status of the <code>ssh-banner-check</code> rule


Manual verification:

SSH to one of the managed instances
Verify the banner appears before the login prompt
Check the content of <code>/etc/ssh/banner</code>
Verify the configuration in <code>/etc/ssh/sshd_config</code>