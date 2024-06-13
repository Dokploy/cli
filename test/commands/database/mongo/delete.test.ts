import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('database:mongo:delete', () => {
  it('runs database:mongo:delete cmd', async () => {
    const {stdout} = await runCommand('database:mongo:delete')
    expect(stdout).to.contain('hello world')
  })

  it('runs database:mongo:delete --name oclif', async () => {
    const {stdout} = await runCommand('database:mongo:delete --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
