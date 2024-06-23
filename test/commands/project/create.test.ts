import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('project:create', () => {
  it('runs project:create cmd', async () => {
    const {stdout} = await runCommand('project:create')
    expect(stdout).to.contain('hello world')
  })

  it('runs project:create --name oclif', async () => {
    const {stdout} = await runCommand('project:create --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
