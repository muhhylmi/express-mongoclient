import KafkaConsumer from '../../../helper/kafka/consumer';
import { registerKafkaInstance } from '../../../helper/kafka/instance';
import { EventCommand } from '../use_case/EventCommand';


class EventNoteHandler {
  private kafka: KafkaConsumer;
  private command: EventCommand;

  constructor(groupId: string, concurencyNumber: number){
    this.kafka = new KafkaConsumer(groupId, concurencyNumber);
    this.command = new EventCommand();
    registerKafkaInstance(this.kafka);
  }

  registerConsumerNoteCreated() {
    this.kafka.registerTopic('note-created', this.command.save);
  }
}

export default EventNoteHandler;