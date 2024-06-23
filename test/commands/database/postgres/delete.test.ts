import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('database:postgres:delete', () => {
  it('runs database:postgres:delete cmd', async () => {
    const {stdout} = await runCommand('database:postgres:delete')
    expect(stdout).to.contain('hello world')
  })

  it('runs database:postgres:delete --name oclif', async () => {
    const {stdout} = await runCommand('database:postgres:delete --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
