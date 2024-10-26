import { createButton } from '../../components/button'
import { openV2PSettings } from '../helpers'

const $settingsHeader = $('.page-content-header')
const $settingsIcon = $settingsHeader.find('> img[src^="/static/img"]')
const $settingsTitle = $settingsHeader.find('> h2')

$settingsHeader.addClass('v2p-settings-header')
$settingsIcon.addClass('v2p-settings-icon')
$settingsTitle.addClass('v2p-settings-title')

const $openSettingsBtn = createButton({
  children: '更改 V2EX Polish 设置',
})

$openSettingsBtn.on('click', () => {
  openV2PSettings()
})

const $actionsArea = $('<div class="v2p-settings-actions" />')

$actionsArea.append($openSettingsBtn)
$settingsHeader.append($actionsArea)
