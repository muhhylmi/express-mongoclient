import KafkaConsumer from '../helper/kafka/consumer';
import { getRegisteredKafkaInstances } from '../helper/kafka/instance';
import EventKafka from '../helper/kafka/producer';
import EventNoteHandler from './notes/handlers/EventHandler';
const eventKafka = new EventKafka();
const eventNoteHandler = new EventNoteHandler('express-mongoclient', 4);

const initEvent = async () => {
  console.log('info', 'consumer is Running...', 'initEvent');
  eventNoteHandler.registerConsumerNoteCreated();

  eventKafka.connect();
  getRegisteredKafkaInstances().forEach((kafka: KafkaConsumer) => kafka.subscribe());
    

  process.on('unhandledRejection', (reason, p) => {
    p.catch(err => {
      console.log('initEvent', JSON.stringify(err.stack), `event listener: ${reason}`);
    });
  });
};

export default initEvent;