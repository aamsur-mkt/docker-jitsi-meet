{{ $CONFIG_BOSH_HOST := .Env.CONFIG_BOSH_HOST | default "" -}}
{{ $CONFIG_EXTERNAL_CONNECT := .Env.CONFIG_EXTERNAL_CONNECT | default "false" | toBool -}}
{{ $CONFIG_USE_FOCUS_USER := .Env.CONFIG_USE_FOCUS_USER | default "true" | toBool -}}
{{ $ENABLE_AUTH := .Env.ENABLE_AUTH | default "false" | toBool -}}
{{ $ENABLE_GUESTS := .Env.ENABLE_GUESTS | default "false" | toBool -}}
{{ $ENABLE_SUBDOMAINS := .Env.ENABLE_SUBDOMAINS | default "false" | toBool -}}
{{ $ENABLE_WEBSOCKETS := .Env.ENABLE_WEBSOCKETS | default "false" | toBool -}}
{{ $JICOFO_AUTH_USER := .Env.JICOFO_AUTH_USER | default "focus" -}}
{{ $XMPP_AUTH_DOMAIN := .Env.XMPP_AUTH_DOMAIN | default "" -}}
{{ $XMPP_AUTH_DOMAIN_PREFIX := .Env.XMPP_AUTH_DOMAIN_PREFIX | default "auth" -}}
{{ $XMPP_DOMAIN := .Env.XMPP_DOMAIN -}}
{{ $XMPP_MUC_DOMAIN := .Env.XMPP_MUC_DOMAIN | default "" -}}
{{ $XMPP_MUC_DOMAIN_PREFIX := .Env.XMPP_MUC_DOMAIN_PREFIX | default "conference" -}}

// begin default config overrides
if (!config.hasOwnProperty('hosts')) config.hosts = {};
config.hosts.domain = '{{ $XMPP_DOMAIN }}';
{{ if $CONFIG_USE_FOCUS_USER -}}
{{ if $XMPP_AUTH_DOMAIN -}}
config.focusUserJid = '{{$JICOFO_AUTH_USER}}@{{$XMPP_AUTH_DOMAIN}}';
{{ else -}}
config.focusUserJid = '{{$JICOFO_AUTH_USER}}@{{$XMPP_AUTH_DOMAIN_PREFIX}}.{{$XMPP_DOMAIN}}';
{{ end -}}
{{ else -}}
config.hosts.focus = 'focus.{{ $XMPP_DOMAIN }}';
{{ end -}}

{{ if $ENABLE_SUBDOMAINS -}}
var subdomain = "<!--# echo var="subdomain" default="" -->";
if (subdomain) {
    subdomain = subdomain.substr(0,subdomain.length-1).split('.').join('_').toLowerCase() + '.';
}
config.hosts.muc = '{{ $XMPP_MUC_DOMAIN_PREFIX }}.'+subdomain+'{{ $XMPP_DOMAIN }}';
{{ else -}}
{{ if $XMPP_MUC_DOMAIN }}
config.hosts.muc = '{{ $XMPP_MUC_DOMAIN }}';
{{ else -}}
config.hosts.muc = '{{ $XMPP_MUC_DOMAIN_PREFIX }}.{{ $XMPP_DOMAIN }}';
{{ end -}}
{{ end -}}

{{ if $ENABLE_GUESTS -}}
// When using authentication, domain for guest users.
config.hosts.anonymousdomain = '{{ .Env.XMPP_GUEST_DOMAIN }}';
{{ end -}}
{{ if $ENABLE_AUTH -}}
// Domain for authenticated users. Defaults to <domain>.
config.hosts.authdomain = '{{ $XMPP_DOMAIN }}';
{{ end -}}

config.bosh = '{{ if $CONFIG_BOSH_HOST }}https://{{ $CONFIG_BOSH_HOST }}{{ end }}/http-bind';
{{ if $ENABLE_WEBSOCKETS -}}
config.websocket = 'wss://{{ if $CONFIG_BOSH_HOST }}{{ $CONFIG_BOSH_HOST }}{{end}}/xmpp-websocket';
{{ end -}}

{{ if $CONFIG_EXTERNAL_CONNECT -}}
    {{ if $ENABLE_SUBDOMAINS -}}
config.externalConnectUrl = '//{{ if .Env.CONFIG_BOSH_HOST }}{{ .Env.CONFIG_BOSH_HOST }}{{ end }}/<!--# echo var="subdir" default="" -->http-pre-bind';
    {{ else -}}
config.externalConnectUrl = '//{{ if .Env.CONFIG_BOSH_HOST }}{{ .Env.CONFIG_BOSH_HOST }}{{ end }}/http-pre-bind';
    {{ end -}}
{{ end -}}
