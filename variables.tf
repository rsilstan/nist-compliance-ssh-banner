# draft

variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name (e.g., dev, test, prod)"
  type        = string
  default     = "dev"
}

variable "application_name" {
  description = "Name of the application these resources belong to"
  type        = string
  default     = "nist-compliance"
}

variable "banner_text" {
  description = "Text to display in the SSH banner"
  type        = string
  default     = "This system may contain Controlled Unclassified Information (CUI) and therefore is to be used by authorized users only. Individuals using this computer system without authority, or in excess of their authority, are subject to having all of their activities on this system monitored and recorded by system personnel. In the case of individuals improperly using this system, or in the course of system maintenance, the activities of authorized users may also be monitored. Anyone using this system expressly consents to such monitoring and is advised that if such monitoring reveals possible evidence of criminal activity, system personnel may provide the evidence of such monitoring to law enforcement officials."
}

variable "create_test_instance" {
  description = "Whether to create a test EC2 instance"
  type        = bool
  default     = true
}

variable "ami_id" {
  description = "AMI ID for the test instance"
  type        = string
  default     = "ami-0c55b159cbfafe1f0" # Amazon Linux 2 in us-east-1, update as needed
}

variable "subnet_id" {
  description = "Subnet ID for the test instance"
  type        = string
  default     = ""
}

variable "security_group_id" {
  description = "Security group ID for the test instance"
  type        = string
  default     = ""
}