import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('database:redis:delete', () => {
  it('runs database:redis:delete cmd', async () => {
    const {stdout} = await runCommand('database:redis:delete')
    expect(stdout).to.contain('hello world')
  })

  it('runs database:redis:delete --name oclif', async () => {
    const {stdout} = await runCommand('database:redis:delete --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
