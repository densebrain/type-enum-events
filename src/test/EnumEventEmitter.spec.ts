
import 'jest'
import {EnumEventEmitter} from "../EnumEventEmitter"

enum SampleEnum {
  val1,
  val2
}

class SampleEnumEmitter extends EnumEventEmitter<SampleEnum> {
  constructor() {
    super(SampleEnum)
  }
  
}

test('Enum event emit',() => {
  return new Promise((resolve,reject) => {
    const
      emitter = new SampleEnumEmitter()
    
    emitter.on(SampleEnum.val2,(type:SampleEnum,arg) => {
      expect(arg).toBe('test')
      resolve()
    })
    
    
    emitter.emit(SampleEnum.val2,'test')
  })
})