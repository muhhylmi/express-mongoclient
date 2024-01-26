import { Kafka, Producer as KafkaProducer, Consumer as KafkaConsumer, EachMessagePayload, KafkaConfig, Producer, ProducerRecord, IHeaders } from 'kafkajs';
import { config } from '../config/globalConfig';
import { v4 as uuidv4, v4 } from 'uuid';
const kafkaHost = config.KAFKA_HOSTS

class EventKafka {
    static producer: KafkaProducer | undefined
    private connected:Boolean = false;
    
    constructor(){}

    async connect(): Promise<void> {
        const option: KafkaConfig = {
            brokers: kafkaHost.split(','),
            clientId: 'express-mongoclient',
            logLevel: 4,
        }
        
        const kafkaClient:Kafka = new Kafka(option);
        EventKafka.producer = kafkaClient.producer()
        while(!this.connected) {
            try {
                await EventKafka.producer.connect();
                console.log('✅ Kafkajs producer ready', 'ready');
                this.connected = true;
            } catch (err) {
                console.error('❌ some error happened when trying to connect to cluster. retrying...', 'kafkaConnect', err);
            }
        }
    }


    async send(data: any){
        const { body: eventData } = data;
        const header:IHeaders = {
            ["eventId"]: Buffer.from(v4())
        }
        
        const message = {
            value: Buffer.from(JSON.stringify(eventData)),
            headers: header
        };
        
        const record: ProducerRecord = {
            topic: data.topic,
            messages: [message]
        }

        try {
            await EventKafka.producer?.send(record);
            console.log('Kafka producer success publishing to topic', 'kafkajsSendProducer', data.topic);
          } catch (err) {
            console.error('Kafka producer error publishing to topic', 'kafkajsSendProducer', { topic: data.topic, err, message });
          }    
    }


}

export default EventKafka


