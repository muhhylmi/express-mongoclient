import { Consumer, Kafka, KafkaConfig, PartitionAssigners } from 'kafkajs';
import { config } from '../config/globalConfig';
import { Wrapper } from '../wrapper/wrapper';
const kafkaHost = config.KAFKA_HOSTS;


class KafkaConsumer {
  private option: KafkaConfig;
  private kafkaClient: Kafka;
  private consumer: Consumer;
  private topics: Record<string, (value: Buffer | null, header: string) => void | Error | Promise<Wrapper>> = {};
  private groupId: string;
  private concurrencyNumber: number;
  private health: boolean;

  constructor(groupId: string, concurrencyNumber = 1) {
    this.option = {
      brokers: kafkaHost.split(','),
      clientId: 'express-mongoclient',
      logLevel: 4,
    };
    this.kafkaClient = new Kafka(this.option);

    this.consumer = this.kafkaClient.consumer({
      groupId: groupId,
      partitionAssigners: [PartitionAssigners.roundRobin],
      maxBytes: 10 * 1024 * 1024,
      sessionTimeout: 15000,
    });
    this.topics = {};
    this.groupId = groupId;
    this.concurrencyNumber = concurrencyNumber;
    this.health = false;
  }

  registerTopic(topic: string, handler: (value: Buffer | null, header: string) => void | Error | Promise<Wrapper>) {
    this.topics[topic] = handler;
  }

  async connect() {
    let connected = false;
    while (!connected) {
      try {
        await this.consumer.connect();
        connected = true;
      } catch (err) {
        console.error('some error happened when trying to connect to cluster. retrying...', 'kafkaConnect', {groupId: this.groupId, err});
      }
    }
  }


  async subscribe() {
    await this.connect();
        
    try {
      await this.consumer.subscribe({ topic: 'note-created', fromBeginning: false });
          
      await this.consumer.run({
        autoCommit: false,
        partitionsConsumedConcurrently: this.concurrencyNumber,
        eachMessage: async ({ message, topic, partition }) => {
          const { value, offset } = message;
          const headers = (message.headers && message.headers.header) ?
            JSON.parse(message.headers.header.toString()) : {};

          const result = await this.topics[topic](value, headers);

          if (result instanceof Error) {
            console.error(`Kafka handler error when handling topic ${topic}`, 'run', result.message);
          } else {                
            try {
              await this.consumer.commitOffsets([{ topic, partition, offset: (Number(offset) + 1).toString() }]);
              console.debug(`Kafka commit success to topic ${topic}`, value?.toString('utf-8'));
            } catch(err) {
              console.error(`Kafka commit failed to topic ${topic}`, err);
            }
          }
    
        }
      });
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Kafkajs consumer error: ${error.message}`, 'run', error);
      } else {
        console.error('Unknown error type:', error);
      }
    }
    
    this.health = true;
    
    process.once('SIGINT', async() => {
      console.info(`Closing consumer on groupId ${this.groupId}`);
      const result = await this.consumer.disconnect();
      console.info(`Consumer on groupId ${this.groupId} is closed`, 'consumerClose', result);
    });
    
    this.consumer.on(this.consumer.events.CRASH, () => this.health = false);
    this.consumer.on(this.consumer.events.CONNECT, () => this.health = true);
  }


}

export default KafkaConsumer;