import { expect } from 'chai'
import * as sinon from 'sinon'
import ActionStore from '../src/tracker/ActionStore'
import ActionType from '../src/tracker/ActionType'

import actions from './test-script-actions'

describe('ActionStore', () => {
  const devtoolShouldUpdateSpy = sinon.spy()

  let actionStore: IActionStore

  beforeEach(() => {
    actionStore = new ActionStore(devtoolShouldUpdateSpy)
  })

  afterEach(() => {
    devtoolShouldUpdateSpy.reset()
  })

  describe('get', () => {
    it('should return [] given non-exsiting trackid', () => {
      expect(actionStore.get(undefined)).to.deep.equal([])
      expect(actionStore.get(null)).to.deep.equal([])
      expect(actionStore.get('-1')).to.deep.equal([])
      expect(actionStore.get('')).to.deep.equal([])
    })
  })

  describe('register', () => {
    it('should add action record to ActionStore grouped by trackid', async () => {
      await actionStore.register('1', actions[0].record)
      await actionStore.register('2', actions[1].record)

      expect(actionStore.get('1')).to.deep.equal([actions[0].record])
      expect(actionStore.get('2')).to.deep.equal([actions[1].record])
    })

    it('should apply FILO on action records in trackid group in ActionStore', async () => {
      await actionStore.register('1', actions[0].record)
      await actionStore.register('1', actions[1].record)

      expect(actionStore.get('1')).to.deep.equal([actions[1].record, actions[0].record])
    })

    it('should not allow ActionStore to add duplicate (same source.loc) records to same trackid group', async () => {
      await actionStore.register('1', actions[0].record)
      await actionStore.register('1', actions[0].record)

      expect(actionStore.get('1')).to.deep.equal([actions[0].record])
    })

    it('should allow ActionStore to add duplicate (same source.loc) records to different trackid group', async () => {
      await actionStore.register('1', actions[0].record)
      await actionStore.register('2', actions[0].record)

      expect(actionStore.get('1')).to.deep.equal([actions[0].record])
      expect(actionStore.get('2')).to.deep.equal([actions[0].record])
    })
  })

  describe('registerFromActionInfo', () => {

    // @NOTE: all info have trackid '1' by default

    it('should transform action info into record and add it to ActionStore', async () => {
      await actionStore.registerFromActionInfo(actions[0].info)

      expect(actionStore.get('1')).to.deep.equal([actions[0].record])
    })

    it('should transform action info into record and add it to ActionStore (actionTag scenario)', async () => {
      await actionStore.registerFromActionInfo(actions[2].info)

      expect(actionStore.get('1')).to.deep.equal([actions[2].record])
    })

    it('should apply FILO on action records transformed from info in trackid group in ActionStore', async () => {
      await actionStore.registerFromActionInfo(actions[0].info)
      await actionStore.registerFromActionInfo(actions[1].info)

      expect(actionStore.get('1')).to.deep.equal([actions[1].record, actions[0].record])
    })

    it('should not allow ActionStore to add duplicate (same source.loc) records (parsed from info) to same trackid group', async () => {
      await actionStore.registerFromActionInfo(actions[0].info)
      await actionStore.registerFromActionInfo(actions[0].info)

      expect(actionStore.get('1')).to.deep.equal([actions[0].record])
    })

    it('should allow ActionStore to add duplicate (same source.loc) records (parsed from info) to different trackid group', async () => {
      await actionStore.registerFromActionInfo(actions[0].info)
      await actionStore.registerFromActionInfo(
        Object.assign({}, actions[0].info, { trackid: '2' })
      )
      expect(actionStore.get('1')).to.deep.equal([actions[0].record])
      expect(actionStore.get('2')).to.deep.equal([actions[0].record])
    })

    it('should merge trackid group specified in action info \'merge\' field to the front of target group before adding new record', async () => {
      await actionStore.registerFromActionInfo(actions[0].info)
      await actionStore.registerFromActionInfo(
        Object.assign({}, actions[1].info, { trackid: '2', merge: '1' })
      )
      expect(actionStore.get('1')).to.deep.equal([])
      expect(actionStore.get('2')).to.deep.equal([actions[1].record, actions[0].record])

      // should avoid duplication after merging
      await actionStore.registerFromActionInfo(
        Object.assign({}, actions[0].info, { trackid: '2' })
      )
      expect(actionStore.get('2')).to.deep.equal([actions[1].record, actions[0].record])

      // should allow adding original records to the merged trackid group
      await actionStore.registerFromActionInfo(actions[0].info)

      expect(actionStore.get('1')).to.deep.equal([actions[0].record])
    })
  })

  describe('devtool should be updated upon updating ActionStore', () => {
    it('should call devtoolShouldUpdate with updated trackid and records when ActionStore is updated by register', async () => {
      await actionStore.register('1', actions[0].record)

      expect(
        devtoolShouldUpdateSpy
          .calledWith('1', [actions[0].record])
      ).to.be.true

      await actionStore.register('1', actions[1].record)

      expect(
        devtoolShouldUpdateSpy
          .calledWith('1', [actions[1].record, actions[0].record])
      ).to.be.true
    })

    it('should call devtoolShouldUpdate with updated trackid and records when ActionStore is updated by registerFromActionInfo', async () => {
      await actionStore.registerFromActionInfo(actions[0].info)

      expect(
        devtoolShouldUpdateSpy
          .calledWith('1', [actions[0].record])
      ).to.be.true

      await actionStore.registerFromActionInfo(actions[1].info)

      expect(
        devtoolShouldUpdateSpy
          .calledWith('1', [actions[1].record, actions[0].record])
      ).to.be.true
    })
  })
})