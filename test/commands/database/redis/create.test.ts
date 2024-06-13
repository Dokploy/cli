import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('database:redis:create', () => {
  it('runs database:redis:create cmd', async () => {
    const {stdout} = await runCommand('database:redis:create')
    expect(stdout).to.contain('hello world')
  })

  it('runs database:redis:create --name oclif', async () => {
    const {stdout} = await runCommand('database:redis:create --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
