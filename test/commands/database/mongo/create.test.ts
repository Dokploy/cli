import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('database:mongo:create', () => {
  it('runs database:mongo:create cmd', async () => {
    const {stdout} = await runCommand('database:mongo:create')
    expect(stdout).to.contain('hello world')
  })

  it('runs database:mongo:create --name oclif', async () => {
    const {stdout} = await runCommand('database:mongo:create --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
