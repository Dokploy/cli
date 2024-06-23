import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('project:list', () => {
  it('runs project:list cmd', async () => {
    const {stdout} = await runCommand('project:list')
    expect(stdout).to.contain('hello world')
  })

  it('runs project:list --name oclif', async () => {
    const {stdout} = await runCommand('project:list --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
