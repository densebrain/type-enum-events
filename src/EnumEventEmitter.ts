
import {EventEmitter} from 'events'

import {enumKeys} from "./EnumUtil"

export interface IEnumEventHandler<E extends object, K extends keyof E, V extends E[K]> {
	<EventKey extends K>(event:EventKey,data:E[EventKey]):any
}

export type WrappedEventHandler<Handler extends IEnumEventHandler<any, any, any>> = Handler extends  IEnumEventHandler<infer E, infer K, infer V> ? ((data: V) => ReturnType<Handler>) : never

/**
 * Returned from 'on' to unsubscribe
 */
export interface IEnumEventRemover {
	():void
}

/**
 * Enum based EventEmitter
 */
export class EnumEventEmitter<E extends object, K extends keyof E = keyof E, V extends E[K] = E[K]> {

	/**
	 * Internal reference to Node EventEmitter
	 *
	 */
	private emitter = new EventEmitter()
	
	//private enumConstants: Array<Exclude<K, number>>
	
	/**
	 * Create a new emitter
	 *
	 * @param enumValues
	 */
	constructor() {
		//this.enumConstants = Object.keys(enumValues).filter(it => isNumber(it))
	}
	
		
	
	
	/**
	 * Map an enum value to the string value
	 *
	 * @param event
	 */
	//private eventName = (event:K):string => this.enumValues[event as any]
	
	private makeListener = <EventKey extends K>(event:EventKey,listener:IEnumEventHandler<E,EventKey,E[EventKey]>) =>
		(data: E[EventKey]) => listener(event, data)
	
	
	private makeRemover = <EventKey extends K>(event:EventKey,wrappedListener:WrappedEventHandler<IEnumEventHandler<E,EventKey,E[EventKey]>>) =>
		() => this.removeListener(event,wrappedListener)
	
	
	// onAll(listener:IEnumEventHandler<E,K,V>):IEnumEventRemover[] {
	// 		return this.addAllListener(listener)
	// }
	//
	// addAllListener(listener:IEnumEventHandler<E,K,V>):IEnumEventRemover[] {
	// 	return enumKeys(this.enumValues).map((event:any) => {
	// 			return this.addListener(event,listener)
	// 		})
	// }
	
	
	addListener<EventKey extends K>(event: EventKey,listener:IEnumEventHandler<E,EventKey,E[EventKey]>): IEnumEventRemover {
		return this.on(event,listener)
	}
	
	once<EventKey extends K>(event: EventKey,listener:IEnumEventHandler<E,EventKey,E[EventKey]>): IEnumEventRemover {
		return this.on(event,listener,true)
	}
	
	
	off<EventKey extends K>(event: EventKey,listener:WrappedEventHandler<IEnumEventHandler<E,EventKey,E[EventKey]>>): this {
		return this.removeListener(event,listener)
	}
	
	removeListener<EventKey extends K>(event: EventKey,listener:WrappedEventHandler<IEnumEventHandler<E,EventKey,E[EventKey]>>): this {
		this.emitter.removeListener(event as any, listener)
		return this
	}
	
	removeAllListeners<EventKey extends K>(event: EventKey): this {
		this.emitter.removeAllListeners(event as any)
		return this
	}
	
	listeners<EventKey extends K>(event: EventKey): Array<EnumEventEmitter.Handler<E,EventKey,E[EventKey]>> {
		return this.emitter.listeners(event as any) as any
	}
	
	/**
	 * Helper to set unlimited listeners
	 *
	 * @returns {EnumEventEmitter}
	 */
	setUnlimitedListeners() {
		this.emitter.setMaxListeners(0)
		return this
	}
	
	/**
	 * Set the max listener count
	 *
	 * @param listenerCount
	 * @returns {EnumEventEmitter}
	 */
	setMaxListeners(listenerCount:number) {
		this.emitter.setMaxListeners(listenerCount)
		
		return this
	}
	
	/**
	 * Get the max number of listeners
	 *
	 * @returns {any}
	 */
	getMaxListeners() {
		return this.emitter.getMaxListeners()
	}
	
	/**
	 * Current listener count
	 *
	 * @param eventName
	 * @returns {any}
	 */
	listenerCount(eventName:string) {
		return this.emitter.listenerCount(eventName)
	}
	
	/**
	 * On event, trigger handler
	 * @param event
	 * @param listener
	 * @param once
	 * @returns {IEnumEventRemover}
	 */
	on<EventKey extends K>(event:EventKey,listener:IEnumEventHandler<E,EventKey,E[EventKey]>,once = false):IEnumEventRemover {
		const
			//eventName = this.eventName(event),
			wrappedListener = this.makeListener(event,listener),
			remover = this.makeRemover(event,wrappedListener)
		
		this.emitter[once ? 'once' : 'on'].apply(this.emitter,[event as any,wrappedListener])

		return remover
	}
	
	
	

	/**
	 * Emit an event
	 *
	 * @param event
	 * @param data
	 */
	emit<EventKey extends K>(event:EventKey,data:E[EventKey]) {
		this.emitter.emit(event as any,data)
	}

}

export namespace EnumEventEmitter {
    export type Handler<E extends object, K extends keyof E, V extends E[K]> = IEnumEventHandler<E,K,V>
}