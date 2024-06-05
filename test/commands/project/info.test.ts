import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('project:info', () => {
  it('runs project:info cmd', async () => {
    const {stdout} = await runCommand('project:info')
    expect(stdout).to.contain('hello world')
  })

  it('runs project:info --name oclif', async () => {
    const {stdout} = await runCommand('project:info --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
