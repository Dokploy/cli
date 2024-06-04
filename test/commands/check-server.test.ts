import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('check-server', () => {
  it('runs check-server cmd', async () => {
    const {stdout} = await runCommand('check-server')
    expect(stdout).to.contain('hello world')
  })

  it('runs check-server --name oclif', async () => {
    const {stdout} = await runCommand('check-server --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
