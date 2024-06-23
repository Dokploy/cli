import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('database:mariadb:create', () => {
  it('runs database:mariadb:create cmd', async () => {
    const {stdout} = await runCommand('database:mariadb:create')
    expect(stdout).to.contain('hello world')
  })

  it('runs database:mariadb:create --name oclif', async () => {
    const {stdout} = await runCommand('database:mariadb:create --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
