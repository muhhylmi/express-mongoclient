const kafkaInstances:any[] = [];

const registerKafkaInstance = (kafkaInstance: object) => {
  kafkaInstances.push(kafkaInstance);
};

const getRegisteredKafkaInstances = () => kafkaInstances;

export {registerKafkaInstance, getRegisteredKafkaInstances}