// draft Lambda function for checking SSH banner compliance
// zip this to to ssh_banner_check.zip

const AWS = require('aws-sdk');

exports.handler = async (event, context) => {
  const invokingEvent = JSON.parse(event.invokingEvent);
  const configurationItem = invokingEvent.configurationItem;
  const ruleParameters = JSON.parse(event.ruleParameters || '{}');
  
  // Only evaluate EC2 instances
  if (configurationItem.resourceType !== 'AWS::EC2::Instance') {
    return {
      compliance: 'NOT_APPLICABLE',
      annotation: 'Rule only applies to EC2 instances.'
    };
  }
  
  const instanceId = configurationItem.resourceId;
  const ssm = new AWS.SSM();
  
  try {
    // Check if SSM is running on the instance
    const instanceInfo = await ssm.describeInstanceInformation({
      Filters: [{ Key: 'InstanceIds', Values: [instanceId] }]
    }).promise();
    
    if (instanceInfo.InstanceInformationList.length === 0) {
      return {
        compliance: 'NON_COMPLIANT',
        annotation: 'SSM Agent is not running or instance is not managed by SSM.'
      };
    }
    
    // Run command to check SSH banner configuration
    const command = await ssm.sendCommand({
      DocumentName: 'AWS-RunShellScript',
      InstanceIds: [instanceId],
      Parameters: {
        commands: [
          'if grep -q "^Banner /etc/ssh/banner" /etc/ssh/sshd_config && [ -f /etc/ssh/banner ]; then echo "COMPLIANT"; else echo "NON_COMPLIANT"; fi'
        ]
      }
    }).promise();
    
    // Wait for command completion
    const commandId = command.Command.CommandId;
    let commandResult;
    let attempts = 0;
    
    do {
      if (attempts > 0) {
        // Wait 2 seconds before checking again
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      commandResult = await ssm.getCommandInvocation({
        CommandId: commandId,
        InstanceId: instanceId
      }).promise();
      
      attempts++;
    } while (commandResult.Status === 'InProgress' && attempts < 10);
    
    if (commandResult.Status !== 'Success') {
      return {
        compliance: 'INSUFFICIENT_DATA',
        annotation: `Command execution failed: ${commandResult.Status}`
      };
    }
    
    const output = commandResult.StandardOutputContent.trim();
    
    if (output === 'COMPLIANT') {
      return {
        compliance: 'COMPLIANT',
        annotation: 'SSH banner is properly configured'
      };
    } else {
      return {
        compliance: 'NON_COMPLIANT',
        annotation: 'SSH banner is not properly configured'
      };
    }
  } catch (error) {
    console.error('Error:', error);
    return {
      compliance: 'INSUFFICIENT_DATA',
      annotation: `Error checking SSH banner: ${error.message}`
    };
  }
};