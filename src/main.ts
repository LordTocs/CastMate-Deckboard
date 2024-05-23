import fetch from "node-fetch"

export enum PLATFORMS {
	WINDOWS = 'WINDOWS',
	MAC = 'MAC',
	LINUX = 'LINUX',
	SUN = 'SUN',
	OPENBSD = 'OPENBSD',
	ANDROID = 'ANDROID',
	AIX = 'AIX'
};

type InputType = 'input:text' | 'input:key' | 'input:select' | 'input:file' | 'input:folder' | 'input:color' | 'input:checkbox' | 'input:multilinetext' | 'input:autocomplete'

interface ButtonConfigInput {
    label: string
    ref: string
    type: InputType
}

interface ButtonInput {
    label: string,
    value: string,
    fontIcon?: string,
    input: ButtonConfigInput[],
    color?: string,
    icon?: string,
    mode?: string,
}

interface ConfigInput {
    type: string,
    name: string,
    descriptions?: string,
    value: string | Array<string>
}

interface Extension {
    name: string
    platforms: Array<PLATFORMS>
    configs: { [key: string]: ConfigInput }
    inputs: ButtonInput[]
    
    getAutocompleteOptions?(ref: string) : Promise<{ value: string, label: string}[]>
    get selections(): Array<{ header: string } | ButtonInput>
    execute(action: string, params: any): void 
}


class CastMate implements Extension {
    name = "CastMate"
    platforms = [PLATFORMS.WINDOWS]

    configs = {
        castmateIp: {
            type: "text",
            name: "CastMate IP",
            descriptions: "The IP of the computer CastMate is running on.",
            value: "127.0.0.1",
        },
        castmatePort: {
            type: "text",
            name: "CastMate Port",
            descriptions: "The port CastMate is configured to run it's internal server on.",
            value: "8181",
        }
    }

    inputs : ButtonInput[]  = [{
        label: "CastMate Remote",
        value: "castmate-remote",
        icon: "satellite-dish",
        color: '#D554FF',
        input: [
            {
                label: "Button Name",
                ref: "button",
                type: "input:autocomplete"
            }
        ]
    }]

    get selections() {
        return [
			{
				header: this.name
			},
			...this.inputs
		];
    }

    constructor() {
        //console.log("Constructing CastMate")
    }

    get castmateIp() : string {
        return this.configs.castmateIp.value
    }

    get castmatePort() : string {
        return this.configs.castmatePort.value
    }

    async getCastMateRemoteButtons() {
        try {
            const resp = await fetch(`http://${this.castmateIp}:${this.castmatePort}/plugins/remote/buttons`, { method: 'get'})
            const data = await resp.json() as { buttons: string[]}
            
            return data.buttons ?? []
        } catch(err) {
            console.log(err)
            return []
        }
    }

    async pushCastMateButton(button: string) {
        try {
            await fetch(`http://${this.castmateIp}:${this.castmatePort}/plugins/remote/buttons/press?${new URLSearchParams({ button })}`, { method: "post" })
        } catch(err) {
        }
    }

    async getAutocompleteOptions(ref: string) {
        switch(ref) {
            case "button":
                return (await this.getCastMateRemoteButtons()).map(b => ({
                    label: b,
                    value: b
                }))
        }
        return []
    }

    initExtension() {
        console.log("Initing CastMate Extension")
    }

    execute(action: string, params: any) {
        console.log("CastMate Execute", action, params)
        switch(action) {
            case "castmate-remote":
                const { button } = params as { button: string }
                this.pushCastMateButton(button)
                break
        }
    }
}

module.exports = (sendData: any) =>  {
    return new CastMate()
}