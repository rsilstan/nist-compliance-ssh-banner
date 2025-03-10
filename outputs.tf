# draft of outputs.tf

output "ssm_document_name" {
  description = "Name of the SSM document created for SSH banner configuration"
  value       = aws_ssm_document.ssh_banner.name
}

output "ssm_document_version" {
  description = "Version of the SSM document"
  value       = aws_ssm_document.ssh_banner.document_version
}

output "ssm_association_id" {
  description = "ID of the SSM association"
  value       = aws_ssm_association.ssh_banner_association.association_id
}

output "test_instance_id" {
  description = "ID of the test EC2 instance (if created)"
  value       = var.create_test_instance ? aws_instance.test_instance[0].id : "No test instance created"
}

output "test_instance_public_ip" {
  description = "Public IP of the test EC2 instance (if created)"
  value       = var.create_test_instance ? aws_instance.test_instance[0].public_ip : "No test instance created"
}

output "config_rule_id" {
  description = "ID of the AWS Config rule for SSH banner verification"
  value       = aws_config_config_rule.ssh_banner_check.id
}