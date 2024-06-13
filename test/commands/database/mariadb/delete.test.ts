import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('database:mariadb:delete', () => {
  it('runs database:mariadb:delete cmd', async () => {
    const {stdout} = await runCommand('database:mariadb:delete')
    expect(stdout).to.contain('hello world')
  })

  it('runs database:mariadb:delete --name oclif', async () => {
    const {stdout} = await runCommand('database:mariadb:delete --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
