import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('authenticate', () => {
  it('runs authenticate cmd', async () => {
    const {stdout} = await runCommand('authenticate')
    expect(stdout).to.contain('hello world')
  })

  it('runs authenticate --name oclif', async () => {
    const {stdout} = await runCommand('authenticate --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
