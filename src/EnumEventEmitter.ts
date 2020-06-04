
import {EventEmitter} from 'events'
import { isNumber } from "@3fv/guard"

import {enumKeys} from "./EnumUtil"

export interface IEnumEventHandler<E> {
	(event:E,...args:any[]):void
}

/**
 * Returned from 'on' to unsubscribe
 */
export interface IEnumEventRemover {
	():void
}

/**
 * Enum based EventEmitter
 */
export class EnumEventEmitter<E> {

	/**
	 * Internal reference to Node EventEmitter
	 *
	 */
	private emitter = new EventEmitter()
	
	private enumConstants
	
	/**
	 * Create a new emitter
	 *
	 * @param enumValues
	 */
	constructor(private enumValues:any) {
		this.enumConstants = Object.keys(enumValues).filter(it => isNumber(it))
	}
	
		
	
	
	/**
	 * Map an enum value to the string value
	 *
	 * @param event
	 */
	private eventName = (event:E):string => this.enumValues[event as any]
	
	private makeListener = (event:E,listener:IEnumEventHandler<E>) =>
		(...args:any[]) => listener(event,...args)
	
	
	private makeRemover = (event:E,wrappedListener:IEnumEventHandler<E>) =>
		() => this.removeListener(event,wrappedListener)
	
	
	onAll(listener:IEnumEventHandler<E>):IEnumEventRemover[] {
			return this.addAllListener(listener)
	}
	
	addAllListener(listener:IEnumEventHandler<E>):IEnumEventRemover[] {
		return enumKeys(this.enumValues).map((event:any) => {
				return this.addListener(event,listener)
			})
	}
	
	
	addListener(event: E,listener:IEnumEventHandler<E>): IEnumEventRemover {
		return this.on(event,listener)
	}
	
	once(event: E,listener:IEnumEventHandler<E>): IEnumEventRemover {
		return this.on(event,listener,true)
	}
	
	
	off(event: E, listener: EnumEventEmitter.Handler<E>): this {
		return this.removeListener(event,listener)
	}
	
	removeListener(event: E, listener: EnumEventEmitter.Handler<E>): this {
		this.emitter.removeListener(this.eventName(event), listener)
		return this
	}
	
	removeAllListeners(event?: E): this {
		this.emitter.removeAllListeners(this.eventName(event))
		return this
	}
	
	listeners(event: E): Array<EnumEventEmitter.Handler<E>> {
		return this.emitter.listeners(this.eventName(event)) as any
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
	on(event:E,listener:IEnumEventHandler<E>,once = false):IEnumEventRemover {
		const
			eventName = this.eventName(event),
			wrappedListener = this.makeListener(event,listener),
			remover = this.makeRemover(event,wrappedListener)
		
		this.emitter[once ? 'once' : 'on'].apply(this.emitter,[eventName,wrappedListener])

		return remover
	}
	
	
	

	/**
	 * Emit an event
	 *
	 * @param event
	 * @param args
	 */
	emit(event:E,...args:any[]) {
		this.emitter.emit(this.eventName(event),...args)
	}

}

export namespace EnumEventEmitter {
    export type Handler<T> = IEnumEventHandler<T>
}