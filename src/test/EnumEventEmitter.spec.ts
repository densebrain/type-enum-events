
import 'jest'
import {EnumEventEmitter} from "../EnumEventEmitter"

// enum SampleEnum {
//   val1,
//   val2
// }

type SampleEnum = {
  val1: {
    type: "val1"
  }
  val2: {
    type: "val2"
  }
}
class SampleEnumEmitter extends EnumEventEmitter<SampleEnum> {
  constructor() {
    super()
  }
  
}

test('Enum event emit',() => {
  return new Promise((resolve,reject) => {
    const
      emitter = new SampleEnumEmitter()
    
    emitter.on("val2",(type,data) => {
      expect(type).toBe('val2')
      expect(data.type).toBe('val2')
      resolve()
    })
    
    
    emitter.emit("val2",{
      type: "val2"
    })
  })
})