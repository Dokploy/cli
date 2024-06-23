import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('app:create', () => {
  it('runs app:create cmd', async () => {
    const {stdout} = await runCommand('app:create')
    expect(stdout).to.contain('hello world')
  })

  it('runs app:create --name oclif', async () => {
    const {stdout} = await runCommand('app:create --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
