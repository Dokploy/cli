import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('verify', () => {
  it('runs verify cmd', async () => {
    const {stdout} = await runCommand('verify')
    expect(stdout).to.contain('hello world')
  })

  it('runs verify --name oclif', async () => {
    const {stdout} = await runCommand('verify --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
