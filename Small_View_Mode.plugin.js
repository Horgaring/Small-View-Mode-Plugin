/**
 * @name Small View Mode
 * @author Aboba
 * @version 0
 */

/** @type {typeof import("react")} */
const React = BdApi.React;

const { Webpack, Webpack: { Filters }, Data, DOM, Patcher } = BdApi,

	config = {
		PatchName: "Hide",
		cssStyleName: "HideStyle",
	}

	
module.exports = class SmallViewPlugin {
    constructor(meta) {
      
    }
	hidecomponent = () => {
		const [isHide,setHideState] = React.useState(false);

		const ButtonOnClick = () => {
			setHideState(() => !isHide)

			if (isHide) {
				document.getElementsByClassName("sidebar_e031be")[0].classList.add("Hide");
				setTimeout(() => document.getElementsByClassName("wrapper__216eb guilds__2b93a")[0].classList.add("Hide"), 1000);
				
				document.getElementsByClassName(`${config.PatchName}-btn`)[0].classList.add(`${config.PatchName}-btn-active`);
			}
			else {
				document.getElementsByClassName("sidebar_e031be")[0].classList.remove("Hide");
				setTimeout(() => document.getElementsByClassName("wrapper__216eb guilds__2b93a")[0].classList.remove("Hide"), 1000);

				document.getElementsByClassName(`${config.PatchName}-btn`)[0].classList.remove(`${config.PatchName}-btn-active`);
			}
		}

		return  React.createElement("div", {
			
			className: `${config.PatchName}-btn`,
			
			onClick: ButtonOnClick
		});
	}
	patchTitleBar(headerBar) {
		Patcher.before(config.PatchName, ...headerBar, (thisObject, methodArguments, returnValue) => {
			
			if (Array.isArray(methodArguments[0]?.children))
				if (methodArguments[0].children.some?.(child =>
					child?.props?.channel ||
					child?.type?.Header ||
					child?.props?.children === "Nitro" ||
					child?.props?.children?.some?.(grandChild => typeof grandChild === 'string')))
					if (!methodArguments[0].children.some?.(child => child?.key === config.PatchName)){
						console.log(methodArguments[0].children[1].props.children)
						methodArguments[0].children.unshift?.(React.createElement(this.hidecomponent, { key: config.PatchName }));}
			
		});
  };
    start() {
		
		const filter = f => f?.Icon && f.Title,
				modules = Webpack.getModule(m => Object.values(m).some(filter), { first: false });
			for (const module of modules) {
				const HeaderBar = [module, Object.keys(module).find(k => filter(module[k]))];
				this.patchTitleBar(HeaderBar);
			}
		document.getElementsByClassName("sidebar_e031be")[0].style.transition = "2s";
		document.getElementsByClassName("wrapper__216eb guilds__2b93a")[0].style.transition = "2s";
		DOM.addStyle(config.cssStyleName, `
/* Button CSS */
.${config.PatchName}-btn{
    width: 15px;
    height: 15px;
    background-position: center !important;
    background-size: 100% ;
    opacity: 0.8;
    cursor: pointer;
    border-radius: 100%;
    border: 3px solid #000;
	flex: 0 0 auto;
	display: flex;
}
.${config.PatchName}-btn-active {
    background-color: #0f0;
	transition: 2s;
}
.Hide {
	width: 0 ;
	
}
`);
		
    }
  
    stop() {
		DOM.removeStyle(config.cssStyleName);
		Patcher.unpatchAll(config.PatchName);
    }
	
}
