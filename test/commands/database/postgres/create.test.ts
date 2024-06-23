import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('database:postgres:create', () => {
  it('runs database:postgres:create cmd', async () => {
    const {stdout} = await runCommand('database:postgres:create')
    expect(stdout).to.contain('hello world')
  })

  it('runs database:postgres:create --name oclif', async () => {
    const {stdout} = await runCommand('database:postgres:create --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
