import KafkaConsumer from './consumer';

const kafkaInstances:KafkaConsumer[] = [];

const registerKafkaInstance = (kafkaInstance: KafkaConsumer) => {
  kafkaInstances.push(kafkaInstance);
};

const getRegisteredKafkaInstances = () => kafkaInstances;

export {registerKafkaInstance, getRegisteredKafkaInstances};