import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('app:delete', () => {
  it('runs app:delete cmd', async () => {
    const {stdout} = await runCommand('app:delete')
    expect(stdout).to.contain('hello world')
  })

  it('runs app:delete --name oclif', async () => {
    const {stdout} = await runCommand('app:delete --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
