import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('database:mysql:delete', () => {
  it('runs database:mysql:delete cmd', async () => {
    const {stdout} = await runCommand('database:mysql:delete')
    expect(stdout).to.contain('hello world')
  })

  it('runs database:mysql:delete --name oclif', async () => {
    const {stdout} = await runCommand('database:mysql:delete --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
