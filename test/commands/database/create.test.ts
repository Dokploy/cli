import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('database:create', () => {
  it('runs database:create cmd', async () => {
    const {stdout} = await runCommand('database:create')
    expect(stdout).to.contain('hello world')
  })

  it('runs database:create --name oclif', async () => {
    const {stdout} = await runCommand('database:create --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
