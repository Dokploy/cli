import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('database:mysql:create', () => {
  it('runs database:mysql:create cmd', async () => {
    const {stdout} = await runCommand('database:mysql:create')
    expect(stdout).to.contain('hello world')
  })

  it('runs database:mysql:create --name oclif', async () => {
    const {stdout} = await runCommand('database:mysql:create --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
