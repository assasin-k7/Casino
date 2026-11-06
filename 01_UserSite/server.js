const path = require("path");
const express = require("express");
const ejs = require("ejs");
const { createProxyMiddleware } = require("http-proxy-middleware");
const SITE = "<!DOCTYPE html>\n<html lang=\"en\" class=\"h-full antialiased\">\n  <head>\n    <meta charset=\"utf-8\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />\n    <title>Linbet</title>\n    <link rel=\"icon\" href=\"/favicon.ico\" />\n    <link rel=\"stylesheet\" href=\"/css/app.css\" />\n  </head>\n  <body class=\"h-full font-sans\">\n<%\nfunction icon(name, width, height) {\n  const w = typeof width !== \"undefined\" ? Number(width) : (name === \"house\" ? 15 : 16);\n  const h = typeof height !== \"undefined\" ? Number(height) : (name === \"house\" ? Math.round((w * 14) / 18) : name === \"shows\" ? Math.round(w * 0.75) : name === \"live\" ? Math.round((w * 18) / 16) : w);\n  const stroke = 'viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" width=\"' + w + '\" height=\"' + h + '\"';\n\n\nif (name === \"cherry\") return `\n<svg viewBox=\"0 0 16 16\" width=\"${w}\" height=\"${h}\" fill=\"currentColor\"><path d=\"m4.35514362 7.92721639c2.91007931-.66629828 4.44813965.97471551 4.3508 3.23924141-.10319138 2.4005741-1.94800517 4.3507793-4.3508 4.3507793s-4.2476-1.9502052-4.35079138-4.3507793c-.09733966-2.2645259 1.44072069-3.90553969 4.35079138-3.23924141zm3.6274931-.03738966c.7002931-.54673965 1.73978793-.75768276 3.08639998-.44887414 2.7725328-.63450172 4.237269.92980173 4.1444604 3.08638961-.0978759 2.2882311-1.8562293 4.1461937-4.1444604 4.1461937-.916142.0036007-1.80588854-.3066792-2.52110515-.8792126.48664578-.7831112.76167454-1.6791367.79817931-2.6004155.05232414-1.19472934-.30543448-2.25447245-1.00404483-2.9834759-.11162312-.11570699-.2317701-.22287617-.35942931-.32060517zm.83490862-7.85440862c.10442931-.15480172.62792931.23955.7506138.38031724.0588756.06766806.08845543.1559547.08223101.24543407-.00622442.08947938-.04774312.17282021-.11542067.2316849-.34479483.29998276-.67182931.60468793-.98477759.91256896-.00072241.00424138-.0004431.00841035-.00133103.01265173-.31438621 1.50385.62036379 2.65004483 1.52440694 3.75842586.3211948.3763426.6179392.7728841.8884086 1.18718621-.2941333-.0569208-.5921733-.09136574-.8915362-.10303621-.16120003-.21500862-.33937589-.43396207-.520969-.65664828-.79443965-.97404827-1.67392241-2.05685689-1.73426724-3.43637931-1.36350517 1.49199138-2.35765345 3.05372587-2.94072069 4.61642069-.17046724.02173276-.3431862.04895862-.51909138.08553621-.07228275-.01502241-.14352241-.02697759-.21494827-.03950517.60366552-1.75580517 1.69207758-3.50735862 3.21826034-5.16671035.15308659-.16496947.29482416-.34011798.42423966-.5242431.34505345-.49553104.69266034-.99636724 1.03490172-1.50370345zm.89024483 1.19877069c.30354653-.04891724 2.42520003.09100172 3.35097763.78911724 1.1285879.85105 1.0841086 1.17696897 1.5514758 3.41212414-1.2950707-.22524655-2.3635362-.29004828-3.7597258-1.53043448-.7561583-.67817159-1.17434952-1.65557681-1.14272763-2.6708069z\"/></svg>\n`;\nif (name === \"house\") return `\n<svg viewBox=\"0 0 18 14\" width=\"${w}\" height=\"${h}\" fill=\"currentColor\"><path fill-rule=\"evenodd\" d=\"M17.5 7C17.5 3.61726 14.7916 0.875 11.4506 0.875C11.2947 0.875 11.1401 0.880974 10.9872 0.892708L0 1.3125L8.05787 1.92824C7.18522 2.52785 6.47549 3.35228 6.00984 4.31934L1.94444 4.59375L5.78335 4.85288C5.53631 5.52103 5.40123 6.24454 5.40123 7C5.40123 7.75546 5.53631 8.47897 5.78335 9.14712L1.94444 9.40625L6.00984 9.68067C6.47549 10.6477 7.18522 11.4722 8.05787 12.0718L0 12.6875L10.9872 13.1073C11.1401 13.119 11.2947 13.125 11.4506 13.125C14.7916 13.125 17.5 10.3827 17.5 7ZM9.1821 7C9.1821 8.26853 10.1977 9.29687 11.4506 9.29687C12.7035 9.29687 13.7191 8.26853 13.7191 7C13.7191 5.73147 12.7035 4.70312 11.4506 4.70312C10.1977 4.70312 9.1821 5.73147 9.1821 7Z\"/></svg>\n`;\nif (name === \"shows\") return `\n<svg viewBox=\"0 0 16 12\" width=\"${w}\" height=\"${h}\" fill=\"currentColor\"><path fill-rule=\"evenodd\" d=\"M12.7919 6.7823C12.7919 7.67645 10.6465 8.1072 8 8.1072C5.35352 8.1072 3.20812 7.75742 3.20812 6.7823L3.03731 1.49157C3.03731 0.516452 5.35352 0.166687 8 0.166687C10.6465 0.166687 12.9627 0.597429 12.9627 1.49157L12.7919 6.7823ZM12.7919 8.14973C12.7919 8.11317 12.8281 8.08584 12.8654 8.09364C14.4775 8.43104 15.5 8.98163 15.5 9.75968C15.5 11.1699 12.1421 11.8333 7.99999 11.8333C3.85786 11.8333 0.5 11.1525 0.5 9.75968C0.5 8.99535 1.51154 8.44557 3.10857 8.10493C3.15906 8.09415 3.20811 8.13123 3.20811 8.1808V8.43478C3.20811 9.4099 5.35351 9.75968 7.99999 9.75968C10.6465 9.75968 12.7919 9.32894 12.7919 8.43478V8.14973Z\"/></svg>\n`;\nif (name === \"live\") return `\n<svg viewBox=\"0 0 16 18\" width=\"${w}\" height=\"${h}\" fill=\"currentColor\"><path fill-rule=\"evenodd\" d=\"M9.14769 0.802287L3.20448 3.8461C2.62026 4.1453 2.39883 4.84306 2.71 5.40486L7.30028 13.6922C7.61137 14.2538 8.33725 14.4668 8.92148 14.1676L14.8647 11.1238C15.4491 10.8245 15.6703 10.1264 15.3592 9.56476L10.769 1.27747C10.4578 0.715676 9.73207 0.502998 9.14769 0.802287ZM8.88913 4.8825C8.16079 4.76875 7.39137 4.39657 7.21952 4.20203C7.28436 4.45419 7.16379 5.2997 6.85207 5.96733C6.76616 6.15156 6.64572 6.34123 6.5202 6.5389C6.14743 7.12593 5.72985 7.78353 6.03852 8.57891C6.66392 10.1905 9.08587 9.6465 9.12677 8.04029C9.41181 8.67186 9.6997 9.87362 8.52883 10.9857C8.52529 10.989 8.52192 10.9924 8.51859 10.9958C8.51669 10.9978 8.5148 10.9997 8.51291 11.0017C8.507 11.0079 8.50106 11.014 8.4944 11.0202L8.58087 10.9742L12.0805 9.11002L12.138 9.07941C12.138 9.07941 12.1244 9.08252 12.1051 9.08643C11.8781 9.13358 10.4039 9.37221 9.34037 7.92655C10.6959 8.78908 12.4991 7.08303 11.5107 5.66472C11.0228 4.96472 10.244 4.94428 9.54865 4.92603C9.31458 4.91989 9.08998 4.91399 8.88913 4.8825ZM15.259 11.858L15.3208 11.8264C15.3437 11.8147 15.3646 11.8009 15.3856 11.7871C15.394 11.7815 15.4025 11.7759 15.4111 11.7705L15.4133 11.7691C15.4225 11.7632 15.432 11.7576 15.4416 11.752C15.457 11.7429 15.4725 11.7338 15.4869 11.7235C15.5101 11.881 15.5021 12.0359 15.4666 12.1828C15.3842 12.3868 15.2464 12.5738 15.0537 12.7184L14.5307 13.111L9.26062 17.0668C8.69121 17.4942 7.86893 17.3973 7.42389 16.8503L0.777643 8.67764C0.332424 8.13037 0.433542 7.34046 1.00287 6.91292L2.25935 5.96973L6.85159 14.2531C7.30571 15.0722 8.36897 15.3836 9.22156 14.9473L9.22381 14.9462L11.8232 13.6161L15.2566 11.8593L15.259 11.858Z\"/></svg>\n`;\nif (name === \"roulette\") return `\n<svg viewBox=\"0 0 18 18\" width=\"${w}\" height=\"${h}\" fill=\"currentColor\"><path fill-rule=\"evenodd\" d=\"M14.6397 2.87247C13.2342 1.57785 11.3846 0.759811 9.34867 0.675463V3.47816C10.6208 3.5509 11.7768 4.04757 12.6788 4.83348L14.6397 2.87247ZM8.65286 3.48257V0.676989C6.61814 0.760362 4.76744 1.57633 3.3612 2.87146L5.35077 4.85756C6.24314 4.06936 7.38899 3.5659 8.65286 3.48257ZM4.85825 5.34968L2.87092 3.36218C1.57662 4.76811 0.759148 6.61828 0.675522 8.65448H3.481C3.56511 7.39003 4.06933 6.24334 4.85825 5.34968ZM4.83341 12.677L2.87162 14.6388C1.57647 13.2361 0.760505 11.3854 0.677175 9.34719H3.47926C3.55216 10.6215 4.04869 11.7777 4.83341 12.677ZM8.65421 17.3245C6.61849 17.2409 4.76881 16.4244 3.36305 15.131L5.32213 13.1722C6.2196 13.9752 7.37669 14.4895 8.65421 14.5745V17.3245ZM17.323 8.65271H14.573C14.4897 7.37839 13.9758 6.21868 13.1737 5.32286L15.132 3.36452C16.4237 4.77074 17.2397 6.61799 17.323 8.65271ZM9.34729 17.3228C11.3855 17.2395 13.2327 16.4236 14.639 15.1284L12.7049 13.1978C11.7987 13.9965 10.632 14.5034 9.34729 14.5763V17.3228ZM13.197 12.7063L15.1296 14.6387C16.423 13.2339 17.2402 11.3851 17.3246 9.34892H14.5774C14.5038 10.634 13.997 11.8003 13.197 12.7063ZM11.1112 12.1527C11.6841 12.1527 12.1529 11.6875 12.1529 11.1111C12.1529 10.5382 11.6841 10.0694 11.1112 10.0694C10.9376 10.0694 10.7744 10.118 10.6285 10.1944L10.191 9.75692C10.3195 9.54855 10.3924 9.30551 10.3924 9.05552C10.3924 8.79163 10.3091 8.53469 10.1737 8.31937L10.6008 7.88882C10.7466 7.96524 10.9098 8.01386 11.0834 8.01386C11.6563 8.01386 12.1251 7.54855 12.1251 6.97219C12.1251 6.39926 11.6563 5.93052 11.0834 5.93052C10.5105 5.93052 10.0417 6.39926 10.0417 6.97219C10.0417 7.118 10.073 7.25689 10.1251 7.38189L9.66675 7.84372C9.46188 7.73259 9.23618 7.66663 9.00354 7.66663C8.75008 7.66663 8.50702 7.73954 8.29869 7.86453L7.86119 7.42703C7.93757 7.28118 7.98619 7.12147 7.98619 6.94438C7.98619 6.3715 7.51744 5.90272 6.94452 5.90272C6.37159 5.90272 5.90285 6.3715 5.90285 6.94438C5.90285 7.52078 6.37159 7.98605 6.94452 7.98605C7.09035 7.98605 7.22924 7.95481 7.35424 7.90272L7.8091 8.3576C7.68758 8.5694 7.61466 8.80553 7.61466 9.05552C7.61466 9.29509 7.67715 9.52079 7.78827 9.71869L7.35424 10.1527C7.22924 10.1007 7.09035 10.0694 6.94452 10.0694C6.37159 10.0694 5.90285 10.5382 5.90285 11.1111C5.90285 11.6875 6.37159 12.1527 6.94452 12.1527C7.51744 12.1527 7.98619 11.6875 7.98619 11.1111C7.98619 10.9374 7.93757 10.7743 7.86119 10.6284L8.26396 10.2256C8.48271 10.3646 8.73618 10.4444 9.00354 10.4444C9.25008 10.4444 9.48966 10.3749 9.70146 10.2465L10.1528 10.7014C10.1008 10.8263 10.0695 10.9652 10.0695 11.1111C10.0695 11.6875 10.5383 12.1527 11.1112 12.1527Z\"/></svg>\n`;\nif (name === \"spark\") return `\n<svg ${stroke}><path d=\"M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z\"/><path d=\"M20 2v4\"/><path d=\"M22 4h-4\"/><circle cx=\"4\" cy=\"20\" r=\"2\"/></svg>\n`;\nif (name === \"swords\") return `\n<svg ${stroke}><path d=\"m13 19 6-6\"/><path d=\"M14.5 17.5 3.586 6.586A2 2 0 013 5.172V3h2.172a2 2 0 011.414.586L17.5 14.5\"/><path d=\"m14.828 6.172 2.586-2.586A2 2 0 0118.828 3H21v2.172a2 2 0 01-.586 1.414l-2.586 2.586\"/><path d=\"m16 16 4 4\"/><path d=\"m19 21 2-2\"/><path d=\"m5 14 4 4\"/><path d=\"m5 21-2-2\"/><path d=\"M7.5 16.5 4 20\"/></svg>\n`;\nif (name === \"spade\") return `\n<svg ${stroke}><path d=\"M12 18v4\"/><path d=\"M2 14.499a5.5 5.5 0 0 0 9.591 3.675.6.6 0 0 1 .818.001A5.5 5.5 0 0 0 22 14.5c0-2.29-1.5-4-3-5.5l-5.492-5.312a2 2 0 0 0-3-.02L5 8.999c-1.5 1.5-3 3.2-3 5.5\"/></svg>\n`;\nif (name === \"layers\") return `\n<svg ${stroke}><path d=\"M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z\"/><path d=\"M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12\"/><path d=\"M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17\"/></svg>\n`;\nif (name === \"flag\") return `\n<svg ${stroke}><path d=\"M4 22V4a1 1 0 0 1 .4-.8A6 6 0 0 1 8 2c3 0 5 2 7.333 2q2 0 3.067-.8A1 1 0 0 1 20 4v10a1 1 0 0 1-.4.8A6 6 0 0 1 16 16c-3 0-5-2-8-2a6 6 0 0 0-4 1.528\"/></svg>\n`;\nif (name === \"users\") return `\n<svg ${stroke}><path d=\"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2\"/><path d=\"M16 3.128a4 4 0 0 1 0 7.744\"/><path d=\"M22 21v-2a4 4 0 0 0-3-3.87\"/><circle cx=\"9\" cy=\"7\" r=\"4\"/></svg>\n`;\nif (name === \"ticket\") return `\n<svg ${stroke}><path d=\"M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z\"/><path d=\"M13 5v2\"/><path d=\"M13 17v2\"/><path d=\"M13 11v2\"/></svg>\n`;\nif (name === \"trophy\") return `\n<svg ${stroke}><path d=\"M10 14.66V17a1 1 0 0 1-1 1 2 2 0 0 0-2 2v2\"/><path d=\"M14 14.66V17a1 1 0 0 0 1 1 2 2 0 0 1 2 2v2\"/><path d=\"M17.916 10H19.5A2.5 2.5 0 0 0 22 7.5V5a1 1 0 0 0-1-1h-3\"/><path d=\"M4 22h16\"/><path d=\"M6 9a6 6 0 0 0 12 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z\"/><path d=\"M6.084 10H4.5A2.5 2.5 0 0 1 2 7.5V5a1 1 0 0 1 1-1h3\"/></svg>\n`;\nif (name === \"wallet\") return `\n<svg ${stroke}><path d=\"M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1\"/><path d=\"M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4\"/></svg>\n`;\nif (name === \"shield\") return `\n<svg ${stroke}><path d=\"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z\"/></svg>\n`;\nif (name === \"circledot\") return `\n<svg ${stroke}><circle cx=\"12\" cy=\"12\" r=\"1\"/><circle cx=\"12\" cy=\"12\" r=\"10\"/></svg>\n`;\nif (name === \"megaphone\") return `\n<svg ${stroke}><path d=\"M11 6a13 13 0 0 0 8.4-2.8A1 1 0 0 1 21 4v12a1 1 0 0 1-1.6.8A13 13 0 0 0 11 14H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z\"/><path d=\"M6 14a12 12 0 0 0 2.4 7.2 2 2 0 0 0 3.2-2.4A8 8 0 0 1 10 14\"/><path d=\"M8 6v8\"/></svg>\n`;\nreturn \"\";\n\n}\n\nfunction h(value) {\n  return String(value == null ? \"\" : value).replace(/&/g, \"&amp;\").replace(/</g, \"&lt;\").replace(/>/g, \"&gt;\").replace(/\"/g, \"&quot;\");\n}\nfunction thumb(game) {\n  const live = game.status === \"live\";\n  const slot = game.demo && game.kind && game.kind !== \"original\";\n  const href = \"/games/\" + encodeURIComponent(game.slug);\n  const fallback = game.kind === \"playngo\" ? \"/assets/providers/playngo.svg\" : game.kind === \"hacksaw\" ? \"/assets/providers/hacksaw.svg\" : \"/assets/providers/pragmatic.svg\";\n  const img = '<img src=\"' + h(game.image) + '\" alt=\"' + h(game.nameEn) + '\" loading=\"lazy\" class=\"thumb-img h-full w-full object-cover object-center\" data-fallback=\"' + h(live ? fallback : \"/assets/providers/pragmatic.svg\") + '\" />';\n  const media = live ? '<a href=\"' + href + '\" class=\"absolute inset-0 z-0 block\">' + img + \"</a>\" : img + '<div class=\"absolute top-1.5 right-1.5 z-10 rounded bg-black/55 px-1.5 py-0.5 text-[10px] font-bold text-primary\">SOON</div>';\n  const actions = slot && live ? '<div class=\"game-thumb-actions z-10\"><a href=\"' + href + '?mode=real\" class=\"game-thumb-btn game-thumb-btn-real\" data-i18n=\"playReal\">real play</a><a href=\"' + href + '?mode=demo\" class=\"game-thumb-btn game-thumb-btn-demo\" data-i18n=\"playDemo\">demo</a></div>' : \"\";\n  return '<article class=\"game-thumb relative h-[200px] w-[150px] shrink-0 overflow-hidden\" data-name=\"' + h(game.nameEn) + '\" data-provider=\"' + h(game.provider) + '\">' + media + actions + \"</article>\";\n}\nfunction selectMenu(id, kind, labelKey, value, options) {\n  const buttons = options.map((option) => '<button type=\"button\" data-value=\"' + h(option) + '\" class=\"select-option flex h-10 w-full items-center justify-between px-3 text-left text-[13px] font-medium text-text2 hover:bg-[rgb(203_215_255/0.05)] hover:text-white\"><span class=\"select-option-label\">' + h(option) + '</span><svg class=\"select-check hidden text-success\" width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M20 6 9 17l-5-5\"/></svg></button>').join(\"\");\n  return '<div class=\"select-menu relative\" data-select=\"' + h(id) + '\" data-kind=\"' + h(kind) + '\"><button type=\"button\" class=\"select-menu-btn flex h-[50px] min-w-[148px] items-center rounded-lg bg-[rgb(203_215_255/0.03)] px-4 text-[14px] font-medium hover:bg-[rgb(203_215_255/0.07)]\"><span class=\"text-text2\" data-i18n=\"' + h(labelKey) + '\">' + h(labelKey) + '</span><span class=\"text-text2\">:</span><span class=\"select-menu-value ml-1 text-white\">' + h(value) + '</span><svg class=\"select-menu-chevron ml-3 text-text3 transition-transform duration-200\" width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m6 9 6 6 6-6\"/></svg></button><div class=\"select-menu-list absolute right-0 z-40 mt-1.5 hidden min-w-[220px] overflow-hidden rounded-lg border border-border2 bg-bg3 py-1 shadow-[0_12px_40px_rgb(0_0_0/0.45)]\"><div class=\"select-menu-options max-h-[280px] overflow-y-auto\">' + buttons + '</div></div><input type=\"hidden\" id=\"' + h(id) + '\" value=\"' + h(value) + '\" /></div>';\n}\n\n%>\n    <div class=\"flex h-full flex-col bg-bg2\">\n      <header class=\"flex h-16 shrink-0 items-center gap-3 border-b border-border2 bg-bg0 px-4\">\n  <button\n    id=\"menu-btn\"\n    type=\"button\"\n    class=\"grid h-9 w-9 place-items-center rounded-lg text-text2 hover:bg-[rgb(203_215_255/0.055)] hover:text-white lg:hidden\"\n    data-i18n-aria=\"menu\"\n    aria-label=\"menu\"\n  >\n    <svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\"><path d=\"M4 6h16M4 12h16M4 18h16\"/></svg>\n  </button>\n\n  <a href=\"/\" class=\"flex items-center gap-2 pr-2\">\n    <img src=\"/brand/logo.svg\" alt=\"\" class=\"h-[30px] w-auto\" />\n    <span class=\"text-[21px] leading-none font-black tracking-[0.05em] text-white\">LINBET</span>\n  </a>\n\n  <div class=\"flex-1\"></div>\n\n  <div id=\"lang-wrap\" class=\"relative\">\n    <button\n      id=\"lang-btn\"\n      type=\"button\"\n      class=\"flex h-10 items-center gap-2 rounded-lg bg-bg3 pr-2.5 pl-2.5 text-[13px] font-bold text-white hover:bg-bg5\"\n      data-i18n-aria=\"language\"\n      aria-label=\"language\"\n      aria-expanded=\"false\"\n    >\n      <span id=\"lang-flag\"></span>\n      <span id=\"lang-label\">English</span>\n      <svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" class=\"text-text3\"><path d=\"m6 9 6 6 6-6\"/></svg>\n    </button>\n    <div id=\"lang-menu\" class=\"absolute right-0 z-50 mt-1.5 hidden min-w-[168px] overflow-hidden rounded-lg border border-border2 bg-bg3 py-1 shadow-[0_12px_40px_rgb(0_0_0/0.45)]\">\n      <button type=\"button\" data-locale=\"en\" class=\"flex h-10 w-full items-center gap-2.5 px-3 text-left text-[13px] font-bold text-text2 hover:bg-[rgb(203_215_255/0.05)] hover:text-white\">English</button>\n    </div>\n  </div>\n\n  <div id=\"auth-slot\" class=\"flex items-center gap-4\">\n    <div class=\"h-10 w-28 animate-pulse rounded-lg bg-bg3\"></div>\n  </div>\n</header>\n\n      <div class=\"flex min-h-0 flex-1\">\n        <%\n  const p = path || \"/\";\n  const onLobby = p === \"/\" || p === \"/casino\";\n  const onGame = p.startsWith(\"/games\");\n  const casinoParent = onLobby || onGame;\n  const casinoItems = [\n    { href: \"/casino/originals\", key: \"linbetOriginals\", icon: \"house\" },\n    { href: \"/\", key: \"bonusBattles\", icon: \"swords\", soon: true },\n    { href: \"/casino/slots\", key: \"slots\", icon: \"spark\" },\n    { href: \"/casino/shows\", key: \"gameShows\", icon: \"shows\" },\n    { href: \"/casino/live\", key: \"liveCasino\", icon: \"live\" },\n    { href: \"/casino/roulette\", key: \"roulette\", icon: \"circledot\" },\n    { href: \"/\", key: \"blackjack\", icon: \"spade\", soon: true },\n    { href: \"/\", key: \"withSidebets\", icon: \"layers\", soon: true },\n    { href: \"/\", key: \"withChallenges\", icon: \"flag\", soon: true },\n    { href: \"/\", key: \"challenges\", icon: \"flag\", soon: true },\n    { href: \"/\", key: \"clans\", icon: \"users\", soon: true },\n    { href: \"/\", key: \"rollercoaster\", icon: \"ticket\", soon: true },\n  ];\n  const submenu = casinoItems.some((item) => !item.soon && item.href !== \"/\" && p.startsWith(item.href));\n  const pvp = [\n    { key: \"bonusBattles\", icon: \"swords\" },\n    { key: \"jackpot\", icon: \"trophy\" },\n    { key: \"duelArena\", icon: \"swords\" },\n  ];\n  const more = [\n    { href: \"/wallet\", key: \"wallet\", icon: \"wallet\" },\n    { href: \"/fairness\", key: \"provablyFair\", icon: \"shield\" },\n    { href: \"/\", key: \"dailyRace\", icon: \"trophy\", soon: true },\n  ];\n  function activeSub(item) {\n    return !item.soon && item.href !== \"/\" && p.startsWith(item.href);\n  }\n%>\n<button id=\"nav-backdrop\" class=\"fixed inset-0 z-30 hidden bg-black/60 lg:hidden\" data-i18n-aria=\"closeMenu\" aria-label=\"Close menu\"></button>\n<aside id=\"sidebar\" class=\"fixed inset-y-0 left-0 z-40 flex w-[240px] -translate-x-full flex-col border-r border-border2 bg-bg0 transition-[width,transform] duration-200 lg:static lg:z-0 lg:translate-x-0\">\n  <nav class=\"min-h-0 flex-1 space-y-[2px] overflow-y-auto px-2 py-3\">\n    <div id=\"casino-head\" class=\"flex items-center gap-0.5\">\n      <a href=\"/\" data-nav class=\"nav-item flex h-9 min-w-0 flex-1 items-center gap-2.5 rounded-lg px-3 text-[14px] font-medium <%= casinoParent && !submenu ? 'active-parent' : '' %>\">\n        <span class=\"<%= casinoParent && !submenu ? 'text-[#ffffc1]' : 'text-icon-med' %>\">\n          <%- icon(\"cherry\", 16, 16) %>\n        </span>\n        <span class=\"nav-label truncate\" data-i18n=\"casino\">casino</span>\n      </a>\n      <button id=\"casino-toggle\" type=\"button\" class=\"nav-only grid h-6 w-[26px] shrink-0 place-items-center rounded-md bg-[rgb(203_215_255/0.075)] text-text3 hover:text-white\" data-i18n-aria=\"toggleCasino\" aria-label=\"casino menu\">\n        <svg id=\"casino-chevron\" width=\"12\" height=\"12\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" class=\"rotate-180 transition-transform duration-300\"><path d=\"m6 9 6 6 6-6\"/></svg>\n      </button>\n    </div>\n    <div id=\"casino-acc\" class=\"accordion is-open\">\n      <div class=\"space-y-[2px]\">\n        <% casinoItems.forEach((item) => { const on = activeSub(item); %>\n          <a href=\"<%= item.soon ? '#' : item.href %>\" data-nav <%= item.soon ? 'data-soon' : '' %> title=\"\" class=\"nav-item nav-sub flex h-9 items-center gap-2.5 rounded-lg px-3 pl-8 text-[14px] font-medium <%= on ? 'active' : '' %> <%= item.soon ? 'opacity-70' : '' %>\">\n            <span class=\"<%= on ? 'text-[#ffffc1]' : 'text-icon-med' %>\">\n              <%- icon(item.icon) %>\n            </span>\n            <span class=\"truncate\" data-i18n=\"<%= item.key %>\"><%= item.key %></span>\n          </a>\n        <% }) %>\n      </div>\n    </div>\n\n    <button id=\"sports-toggle\" type=\"button\" class=\"nav-item flex h-9 w-full items-center gap-2.5 rounded-lg px-3 text-[14px] font-medium opacity-70\">\n      <span class=\"text-icon-med\"><%- icon(\"trophy\") %></span>\n      <span class=\"nav-label truncate\" data-i18n=\"sports\">sports</span>\n      <span class=\"nav-only ml-auto grid h-6 w-[26px] place-items-center rounded-md bg-[rgb(203_215_255/0.075)] text-text3\">\n        <svg id=\"sports-chevron\" width=\"12\" height=\"12\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" class=\"transition-transform duration-300\"><path d=\"m6 9 6 6 6-6\"/></svg>\n      </span>\n    </button>\n    <div id=\"sports-acc\" class=\"accordion\">\n      <div>\n        <p class=\"nav-only px-8 py-1 text-[12px] text-text3\" data-i18n=\"sportsSoon\">Sportsbook · In preparation</p>\n      </div>\n    </div>\n\n    <p class=\"nav-only px-3 pt-3 pb-1 text-[11px] font-medium tracking-[0.08em] text-text3 uppercase\" data-i18n=\"newOnLinbet\">Linbet new</p>\n    <a href=\"#\" data-soon data-nav class=\"nav-item flex h-9 items-center gap-2.5 rounded-lg px-3 text-[14px] font-medium opacity-70\">\n      <span class=\"text-icon-med\"><%- icon(\"megaphone\") %></span>\n      <span class=\"nav-label truncate\" data-i18n=\"promotions\">promotions</span>\n    </a>\n\n    <p class=\"nav-only px-3 pt-3 pb-1 text-[11px] font-medium tracking-[0.08em] text-text3 uppercase\" data-i18n=\"pvp\">PVP</p>\n    <div class=\"nav-rule my-2 hidden h-px bg-border2\"></div>\n    <% pvp.forEach((item) => { %>\n      <a href=\"#\" data-soon data-nav class=\"nav-item flex h-9 items-center gap-2.5 rounded-lg px-3 text-[14px] font-medium opacity-70\">\n        <span class=\"text-icon-med\"><%- icon(item.icon) %></span>\n        <span class=\"nav-label truncate\" data-i18n=\"<%= item.key %>\"><%= item.key %></span>\n      </a>\n    <% }) %>\n\n    <p class=\"nav-only px-3 pt-3 pb-1 text-[11px] font-medium tracking-[0.08em] text-text3 uppercase\" data-i18n=\"more\">see more</p>\n    <div class=\"nav-rule my-2 hidden h-px bg-border2\"></div>\n    <% more.forEach((item) => { const on = !item.soon && p.startsWith(item.href); %>\n      <a href=\"<%= item.soon ? '#' : item.href %>\" data-nav <%= item.soon ? 'data-soon' : '' %> class=\"nav-item flex h-9 items-center gap-2.5 rounded-lg px-3 text-[14px] font-medium <%= on ? 'active' : '' %> <%= item.soon ? 'opacity-70' : '' %>\">\n        <span class=\"<%= on ? 'text-[#ffffc1]' : 'text-icon-med' %>\"><%- icon(item.icon) %></span>\n        <span class=\"nav-label truncate\" data-i18n=\"<%= item.key %>\"><%= item.key %></span>\n      </a>\n    <% }) %>\n  </nav>\n  <div id=\"sidebar-foot\" class=\"border-t border-border2 p-2\">\n    <button id=\"collapse-btn\" type=\"button\" class=\"mb-2 ml-auto hidden h-6 w-7 items-center justify-center rounded-md text-text3 hover:bg-[rgb(203_215_255/0.055)] hover:text-white lg:flex\" data-i18n-aria=\"collapseSidebar\" aria-label=\"Collapse sidebar\">\n      <svg id=\"fold-icon\" width=\"14\" height=\"14\" viewBox=\"0 0 14 14\" fill=\"none\">\n        <path d=\"M2.5 2.5v9\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\"/>\n        <path id=\"fold-arrow\" d=\"M11 3.5 6.8 7 11 10.5\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n      </svg>\n    </button>\n    <button id=\"side-deposit\" type=\"button\" class=\"nav-only mb-2 h-10 w-full rounded-lg bg-bg5 text-[13px] font-extrabold tracking-[0.5px] text-white uppercase hover:bg-[rgb(203_215_255/0.12)] hover:-translate-y-px\" data-i18n=\"deposit\">deposit</button>\n  </div>\n</aside>\n\n        <div class=\"flex min-w-0 flex-1 flex-col\">\n          <main class=\"min-h-0 flex-1 overflow-y-auto\">\n            <div class=\"route-bar is-on\" aria-hidden=\"true\"></div>\n            <div class=\"page-enter\">\n              <% if (page === \"browse\") { %>\n<div id=\"browse\" data-mode=\"<%= mode %>\" class=\"mx-auto max-w-[1280px] space-y-6 px-6 py-6\">\n  <div id=\"live-ticker\" class=\"rounded-xl bg-bg3/80 px-3 py-3\">\n  <div class=\"mb-2 flex items-center gap-3\">\n    <span class=\"flex items-center gap-1.5 text-[12px] font-extrabold tracking-[0.12em] text-white\">\n      <span class=\"live-dot h-1.5 w-1.5 rounded-full bg-danger\"></span>\n      <span data-i18n=\"liveWins\">Real-time winning</span>\n    </span>\n    <div class=\"ticker-periods flex gap-1 text-[11px] font-bold text-text3\">\n      <button type=\"button\" data-period=\"M\" class=\"h-5 w-5 rounded hover:bg-bg5/60 hover:text-white\">M</button>\n      <button type=\"button\" data-period=\"W\" class=\"h-5 w-5 rounded hover:bg-bg5/60 hover:text-white\">W</button>\n      <button type=\"button\" data-period=\"D\" class=\"h-5 w-5 rounded bg-bg5 text-white\">D</button>\n    </div>\n  </div>\n  <div class=\"ticker-row flex gap-2 overflow-x-auto pb-1\"></div>\n</div>\n\n  <%\n  const cats = [\n    { href: \"/\", id: \"lobby\", key: \"lobby\", icon: \"cherry\", w: 20, h: 20 },\n    { href: \"/casino/originals\", id: \"linbet\", key: \"linbetOriginals\", icon: \"house\", w: 22, h: 17 },\n    { href: \"/casino/slots\", id: \"slots\", key: \"slots\", icon: \"cherry\", w: 20, h: 20 },\n    { href: \"/casino/shows\", id: \"shows\", key: \"shows\", icon: \"shows\", w: 20, h: 15 },\n    { href: \"/casino/live\", id: \"live\", key: \"liveCasino\", icon: \"live\", w: 18, h: 20 },\n    { href: \"/casino/roulette\", id: \"roulette\", key: \"roulette\", icon: \"roulette\", w: 20, h: 20 },\n  ];\n%>\n<div class=\"flex gap-3 overflow-x-auto\">\n  <% cats.forEach((cat) => { const on = cat.id === active; %>\n    <a href=\"<%= cat.href %>\" class=\"cat-pill flex h-[84px] w-max min-w-[88px] shrink-0 flex-col items-center justify-center gap-1.5 rounded-lg px-3 text-[13px] leading-none font-semibold <%= on ? 'is-on' : '' %>\">\n      <span class=\"grid h-7 w-7 shrink-0 place-items-center\"><%- icon(cat.icon, cat.w, cat.h) %></span>\n      <span class=\"whitespace-nowrap\" data-i18n=\"<%= cat.key %>\"><%= cat.key %></span>\n    </a>\n  <% }) %>\n</div>\n\n  <div class=\"flex flex-wrap gap-3 <%= mode === 'lobby' ? '' : 'items-center' %>\">\n    <label id=\"search\" class=\"flex h-[50px] items-center rounded-md bg-[rgb(15_17_26/0.55)] px-[15px] transition focus-within:bg-[rgb(15_17_26/0.75)] focus-within:ring-1 focus-within:ring-success/25 <%= mode === 'lobby' ? 'w-full' : 'min-w-[220px] flex-1' %>\">\n      <svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" class=\"mr-3 text-text3\"><circle cx=\"11\" cy=\"11\" r=\"7\"/><path d=\"m20 20-3-3\"/></svg>\n      <input id=\"game-search\" data-i18n-placeholder=\"<%= searchKey %>\" placeholder=\"\" class=\"h-full w-full bg-transparent text-[15px] font-medium text-white outline-none placeholder:text-text3\" />\n    </label>\n    <% if (mode !== \"lobby\") { %>\n      <% const providerOptions = (providers || []).map((name) => (typeof name === \"string\" ? name : name.name)); %>\n      <%- selectMenu(\"provider-filter\", \"provider\", \"provider\", \"All\", providerOptions) %>\n      <%- selectMenu(\"sort-filter\", \"sort\", \"sortBy\", \"popular\", [\"popular\", \"az\"]) %>\n    <% } %>\n  </div>\n  <% if (mode === \"lobby\") { %>\n    <% const rows = [\n      { key: \"linbetOriginals\", href: \"/casino/originals\", games: originals, icon: \"house\", w: 16, h: 12 },\n      { key: \"slots\", href: \"/casino/slots\", games: slots, icon: \"cherry\", w: 16, h: 16 },\n      { key: \"liveCasino\", href: \"/casino/live\", games: live, icon: \"live\", w: 16, h: 18 },\n    ]; %>\n    <% rows.forEach((row) => { %>\n      <section class=\"game-row space-y-2.5\" data-row>\n        <div class=\"flex h-6 items-center justify-between gap-4\">\n          <div class=\"flex min-w-0 items-center gap-2\">\n            <span class=\"text-white\"><%- icon(row.icon, row.w, row.h) %></span>\n            <a href=\"<%= row.href %>\" class=\"text-[14px] font-extrabold text-white uppercase\" data-i18n=\"<%= row.key %>\"><%= row.key %></a>\n            <a href=\"<%= row.href %>\" class=\"text-[14px] font-medium text-primary hover:brightness-125 hover:underline\" data-i18n=\"viewAll\">See all</a>\n          </div>\n          <div class=\"flex items-center gap-1\">\n            <button type=\"button\" data-scroll=\"-1\" class=\"grid h-6 w-8 place-items-center rounded bg-[rgb(203_215_255/0.03)] text-white hover:bg-[rgb(203_215_255/0.08)]\" data-i18n-aria=\"previous\" aria-label=\"before\">\n              <svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"m15 18-6-6 6-6\"/></svg>\n            </button>\n            <button type=\"button\" data-scroll=\"1\" class=\"grid h-6 w-8 place-items-center rounded bg-[rgb(203_215_255/0.03)] text-white hover:bg-[rgb(203_215_255/0.08)]\" data-i18n-aria=\"next\" aria-label=\"next\">\n              <svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"m9 18 6-6-6-6\"/></svg>\n            </button>\n          </div>\n        </div>\n        <div class=\"row-scroller flex gap-3 overflow-x-auto pt-3 pb-3\">\n          <% row.games.forEach((game) => { %><%- thumb(game) %><% }) %>\n        </div>\n      </section>\n    <% }) %>\n    <div class=\"flex flex-wrap items-center justify-center gap-10 rounded-lg bg-bg3 px-6 py-6\">\n      <% providers.forEach((p) => { %>\n        <a href=\"/casino/slots\" class=\"text-[13px] font-semibold text-text3 transition hover:text-white\" title=\"<%= p.name %>\"><%= p.name %></a>\n      <% }) %>\n    </div>\n  <% } else if (mode === \"paged\") { %>\n    <div id=\"paged-status\" class=\"py-16 text-center text-[14px] font-medium text-text3\" data-i18n=\"pleaseWait\">please wait for a moment...</div>\n    <div id=\"paged-grid\" class=\"hidden space-y-6\">\n      <div id=\"slot-grid\" class=\"game-grid\"></div>\n      <div class=\"flex flex-col items-center gap-3\">\n        <p id=\"slot-count\" class=\"text-[13px] font-medium text-text3\"></p>\n        <button id=\"load-more\" type=\"button\" class=\"hidden h-11 min-w-[180px] rounded-lg bg-[rgb(203_215_255/0.075)] px-6 text-[14px] font-bold text-white hover:bg-[rgb(203_215_255/0.12)] disabled:opacity-50\" data-i18n=\"loadMore\">see more</button>\n      </div>\n    </div>\n  <% } else { %>\n    <div id=\"static-grid\" class=\"game-grid\">\n      <% games.forEach((game) => { %><%- thumb(game) %><% }) %>\n    </div>\n    <p id=\"static-empty\" class=\"hidden py-16 text-center text-[14px] font-medium text-text3\" data-i18n=\"noGames\">There are no games</p>\n  <% } %>\n  <section class=\"live-bets pt-2\">\n  <div class=\"mb-2 flex items-center gap-3\">\n    <span class=\"text-[13px] font-extrabold tracking-wide text-white uppercase\" data-i18n=\"bets\">bet</span>\n    <div class=\"bet-tabs flex items-center gap-1\">\n      <button type=\"button\" data-tab=\"all\" class=\"h-8 rounded-md bg-bg5 px-3 text-xs font-bold text-white\" data-i18n=\"allBets\">entire</button>\n      <button type=\"button\" data-tab=\"high\" class=\"h-8 rounded-md px-3 text-xs font-bold text-text3 hover:bg-bg5/50 hover:text-white\" data-i18n=\"highRollers\">high roller</button>\n      <button type=\"button\" data-tab=\"lucky\" class=\"h-8 rounded-md px-3 text-xs font-bold text-text3 hover:bg-bg5/50 hover:text-white\" data-i18n=\"luckyBets\">lucky</button>\n    </div>\n  </div>\n  <div class=\"rounded-lg bg-bg3\">\n    <div class=\"grid grid-cols-[1.1fr_1fr_1fr_1fr_72px] px-4 py-2 text-[11px] font-bold tracking-wide text-text3 uppercase\">\n      <span data-i18n=\"player\">player</span>\n      <span data-i18n=\"game\">game</span>\n      <span data-i18n=\"bet\">bet</span>\n      <span data-i18n=\"payout\">winning</span>\n      <span class=\"text-right\" data-i18n=\"time\">hour</span>\n    </div>\n    <div class=\"bet-rows\"></div>\n  </div>\n</section>\n\n</div>\n              <% } else if (page === \"wallet\") { %>\n<div class=\"mx-auto max-w-3xl px-4 py-6\">\n  <h1 class=\"text-2xl font-black text-white\" data-i18n=\"wallet\">wallet</h1>\n  <p class=\"mt-1 text-sm text-text2\" data-i18n=\"walletSub\">USD wallet</p>\n  <div class=\"mt-5 rounded-lg bg-bg3 p-5\">\n    <div class=\"text-xs font-bold text-text3\" data-i18n=\"balance\">balance</div>\n    <div id=\"wallet-balance\" class=\"text-3xl font-black text-white\">$0</div>\n    <div id=\"wallet-actions\" class=\"mt-4 flex gap-2\"></div>\n  </div>\n  <div id=\"wallet-ledger\" class=\"mt-6 space-y-2\"></div>\n</div>\n\n              <% } else if (page === \"fairness\") { %>\n<div class=\"mx-auto max-w-3xl space-y-5 px-4 py-6\">\n  <h1 class=\"text-2xl font-black text-white\" data-i18n=\"provablyFair\">Fairness Verification</h1>\n  <p class=\"text-sm text-text2\" data-i18n=\"fairnessLead\">The server seed hash is revealed first. Replacing a seed exposes the old seed, allowing any nonce to be recalculated.</p>\n  <section class=\"space-y-3 rounded-lg bg-bg3 p-5\">\n    <div>\n      <div class=\"text-[11px] font-bold tracking-wide text-dim uppercase\" data-i18n=\"serverSeedHash\">server seed (hash)</div>\n      <div id=\"f-hash\" class=\"break-all rounded-lg bg-house px-3 py-2 text-sm text-white\" data-i18n=\"signInSeeds\">Load your seed when you log in</div>\n    </div>\n    <div>\n      <div class=\"text-[11px] font-bold tracking-wide text-dim uppercase\" data-i18n=\"lastRevealed\">Last public server seed</div>\n      <div id=\"f-revealed\" class=\"break-all rounded-lg bg-house px-3 py-2 text-sm text-white\" data-i18n=\"rotateToReveal\">Replacing will reveal the old seed</div>\n    </div>\n    <div>\n      <div class=\"text-[11px] font-bold tracking-wide text-dim uppercase\" data-i18n=\"clientSeed\">client seed</div>\n      <div id=\"f-client\" class=\"break-all rounded-lg bg-house px-3 py-2 text-sm text-white\">player-seed</div>\n    </div>\n    <div>\n      <div class=\"text-[11px] font-bold tracking-wide text-dim uppercase\" data-i18n=\"nonce\">Nonce</div>\n      <div id=\"f-nonce\" class=\"break-all rounded-lg bg-house px-3 py-2 text-sm text-white\">0</div>\n    </div>\n    <div id=\"f-manage\" class=\"hidden space-y-3\">\n      <div class=\"flex gap-2\">\n        <input id=\"f-next\" class=\"h-10 flex-1 rounded-lg border border-white/5 bg-house px-3 text-sm text-white outline-none\" />\n        <button id=\"f-set-client\" type=\"button\" class=\"inline-flex h-10 items-center justify-center rounded-lg border border-border2 bg-bg5 px-3 text-sm font-bold text-white\" data-i18n=\"changeClientSeed\">Change client seed</button>\n      </div>\n      <button id=\"f-rotate\" type=\"button\" class=\"inline-flex h-10 items-center justify-center rounded-lg bg-gold px-3 text-sm font-bold text-text-button\" data-i18n=\"rotateServerSeed\">Replace server seed</button>\n    </div>\n    <p id=\"f-login-note\" class=\"text-sm text-text3\" data-i18n=\"loginSeeds\">Log in to manage your seeds.</p>\n  </section>\n  <form id=\"verify-form\" class=\"space-y-3 rounded-2xl border border-white/5 bg-panel p-5\">\n    <h2 class=\"font-extrabold text-white\" data-i18n=\"verifyResult\">Results Verification</h2>\n    <div id=\"verify-games\" class=\"flex rounded-lg bg-house p-1\">\n      <% [\"dice\",\"mines\",\"plinko\",\"flip\",\"crash\",\"roulette\"].forEach((id) => { %>\n        <button type=\"button\" data-game=\"<%= id %>\" class=\"verify-game h-9 flex-1 rounded-md text-sm font-bold capitalize <%= id === 'dice' ? 'bg-panel-2 text-white' : 'text-dim' %>\" data-i18n=\"<%= id %>\"><%= id %></button>\n      <% }) %>\n    </div>\n    <input id=\"verify-seed\" data-i18n-placeholder=\"revealedSeed\" placeholder=\"Public server seed\" class=\"h-10 w-full rounded-lg border border-white/5 bg-house px-3 text-sm text-white outline-none\" />\n    <input id=\"verify-nonce\" value=\"1\" class=\"h-10 w-full rounded-lg border border-white/5 bg-house px-3 text-sm text-white outline-none\" />\n    <p id=\"verify-crash-note\" class=\"hidden text-xs text-dim\" data-i18n=\"crashNote\">Crash is a shared round. Use public round seeds and nonces. Client seed always crashes.</p>\n    <input id=\"verify-mines\" type=\"number\" min=\"1\" max=\"24\" value=\"3\" class=\"hidden h-10 w-full rounded-lg border border-white/5 bg-house px-3 text-sm text-white outline-none\" />\n    <div id=\"verify-plinko\" class=\"hidden grid grid-cols-2 gap-2\">\n      <select id=\"verify-risk\" class=\"h-10 rounded-lg border border-white/5 bg-house px-3 text-sm font-bold text-white outline-none\">\n        <option value=\"low\">low</option>\n        <option value=\"medium\" selected>medium</option>\n        <option value=\"high\">high</option>\n        <option value=\"expert\">expert</option>\n      </select>\n      <select id=\"verify-rows\" class=\"h-10 rounded-lg border border-white/5 bg-house px-3 text-sm font-bold text-white outline-none\">\n        <% for (let n = 8; n <= 16; n++) { %><option value=\"<%= n %>\" <%= n === 16 ? \"selected\" : \"\" %>><%= n %></option><% } %>\n      </select>\n    </div>\n    <button type=\"submit\" class=\"inline-flex h-10 items-center justify-center rounded-lg bg-success px-3 text-sm font-bold text-text-button\" data-i18n=\"verify\">verification</button>\n    <p id=\"verify-out\" class=\"font-bold text-accent\"></p>\n  </form>\n</div>\n\n              <% } else if (page === \"game\") { %>\n<div class=\"mx-auto max-w-[1280px] space-y-8 px-6 py-5\">\n  <% if (!game || (original === false && slot === false)) { %>\n    <div class=\"p-8 text-center\">\n      <h1 class=\"text-2xl font-black text-white\" data-i18n=\"comingSoon\">preparing</h1>\n      <a href=\"/\" class=\"mt-4 inline-block text-success\" data-i18n=\"backToLobby\">To the lobby</a>\n    </div>\n  <% } else { %>\n    <div class=\"space-y-3\">\n      <header class=\"flex items-center gap-3 px-1\">\n        <img src=\"<%= game.image %>\" alt=\"\" class=\"h-[64px] w-[48px] rounded-lg object-cover shadow-[0_8px_20px_rgb(0_0_0/0.35)]\" />\n        <div>\n          <h1 class=\"font-display text-xl font-black tracking-tight text-white\"><%= game.name %></h1>\n          <p class=\"text-[13px] text-text3\">\n            <span data-blurb=\"<%= game.slug %>\"><%= game.blurb %></span>\n            <% if (game.edge) { %><span> · <span data-i18n=\"houseEdge\" data-i18n-edge=\"<%= game.edge %>\">house edge <%= game.edge %></span></span><% } %>\n          </p>\n        </div>\n      </header>\n\n      <% if (original) { %>\n        <div id=\"original-mount\" data-slug=\"<%= slug %>\"></div>\n        <div class=\"flex flex-wrap items-center justify-between gap-3 text-[13px]\">\n          <div class=\"flex items-center gap-2 text-text3\">\n            <span class=\"grid h-8 w-8 place-items-center rounded-md border border-border2 text-[11px] font-bold\">PF</span>\n            <span class=\"font-semibold tracking-wide uppercase\" data-i18n=\"provablyFairGame\">This game is verifiable</span>\n            <a href=\"/fairness\" class=\"text-text2 underline-offset-2 hover:text-white hover:underline\" data-i18n=\"verification\">verification</a>\n          </div>\n          <a href=\"/fairness\" class=\"font-semibold text-primary hover:brightness-110\" data-i18n=\"howItWorks\">How it works</a>\n        </div>\n      <% } else { %>\n        <div id=\"slot-play\" data-slug=\"<%= slug %>\" data-mode=\"<%= mode %>\" data-image=\"<%= game.image %>\" data-provider=\"<%= game.provider %>\">\n          <% if (!mode) { %>\n            <div class=\"relative overflow-hidden rounded-xl border border-border2 bg-bg3\">\n              <img src=\"<%= game.image %>\" alt=\"\" class=\"h-[min(62vh,560px)] w-full object-cover opacity-35\" />\n              <div class=\"absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/45 px-6 text-center\">\n                <p class=\"text-sm text-text3\" data-i18n=\"slotModeHint\">USD Play for real with your wallet or open a demo without logging in.</p>\n                <div class=\"flex w-full max-w-md flex-col gap-3 sm:flex-row\">\n                  <a href=\"/games/<%= encodeURIComponent(slug) %>?mode=real\" class=\"btn-juicy inline-flex h-12 flex-1 items-center justify-center rounded-lg bg-juicy px-3 text-sm font-extrabold tracking-[0.5px] text-text-button uppercase\" data-i18n=\"playReal\">real play</a>\n                  <a href=\"/games/<%= encodeURIComponent(slug) %>?mode=demo\" class=\"inline-flex h-12 flex-1 items-center justify-center rounded-lg border border-border2 bg-bg5 px-3 text-sm font-bold text-white hover:bg-[rgb(203_215_255/0.1)]\" data-i18n=\"playDemo\">demo</a>\n                </div>\n              </div>\n            </div>\n          <% } else { %>\n            <div id=\"slot-stage\" class=\"grid h-[720px] place-items-center rounded-xl border border-border2 bg-black/40 text-sm text-text3\" data-i18n=\"<%= mode === 'real' ? 'loadingPlay' : 'loadingDemo' %>\">Loading…</div>\n          <% } %>\n        </div>\n      <% } %>\n    </div>\n\n    <section class=\"space-y-3\">\n      <div class=\"flex items-center gap-2\">\n        <h2 class=\"text-[14px] font-extrabold text-white uppercase\" data-i18n=\"moreFromLinbet\">Linbet see more</h2>\n        <a href=\"/casino/originals\" class=\"text-[14px] font-medium text-primary hover:brightness-125 hover:underline\" data-i18n=\"viewAll\">See all</a>\n      </div>\n      <div class=\"flex gap-3 overflow-x-auto pb-2\">\n        <% more.forEach((game) => { %>\n          <%- thumb(game) %>\n        <% }) %>\n      </div>\n    </section>\n    <section class=\"live-bets pt-2\">\n  <div class=\"mb-2 flex items-center gap-3\">\n    <span class=\"text-[13px] font-extrabold tracking-wide text-white uppercase\" data-i18n=\"bets\">bet</span>\n    <div class=\"bet-tabs flex items-center gap-1\">\n      <button type=\"button\" data-tab=\"all\" class=\"h-8 rounded-md bg-bg5 px-3 text-xs font-bold text-white\" data-i18n=\"allBets\">entire</button>\n      <button type=\"button\" data-tab=\"high\" class=\"h-8 rounded-md px-3 text-xs font-bold text-text3 hover:bg-bg5/50 hover:text-white\" data-i18n=\"highRollers\">high roller</button>\n      <button type=\"button\" data-tab=\"lucky\" class=\"h-8 rounded-md px-3 text-xs font-bold text-text3 hover:bg-bg5/50 hover:text-white\" data-i18n=\"luckyBets\">lucky</button>\n    </div>\n  </div>\n  <div class=\"rounded-lg bg-bg3\">\n    <div class=\"grid grid-cols-[1.1fr_1fr_1fr_1fr_72px] px-4 py-2 text-[11px] font-bold tracking-wide text-text3 uppercase\">\n      <span data-i18n=\"player\">player</span>\n      <span data-i18n=\"game\">game</span>\n      <span data-i18n=\"bet\">bet</span>\n      <span data-i18n=\"payout\">winning</span>\n      <span class=\"text-right\" data-i18n=\"time\">hour</span>\n    </div>\n    <div class=\"bet-rows\"></div>\n  </div>\n</section>\n\n  <% } %>\n</div>\n\n              <% } %>\n              <footer class=\"mt-10 border-t border-border2 bg-bg-dark px-6 py-10\">\n  <div class=\"mx-auto grid max-w-[1280px] gap-8 sm:grid-cols-2 lg:grid-cols-4\">\n    <div>\n      <div class=\"mb-3 text-[13px] font-extrabold text-white\" data-i18n=\"casino\">casino</div>\n      <div class=\"space-y-2\">\n        <a href=\"/casino/originals\" class=\"block text-[13px] text-text3 hover:translate-x-0.5 hover:text-white\" data-i18n=\"originals\">original</a>\n        <a href=\"/casino/slots\" class=\"block text-[13px] text-text3 hover:translate-x-0.5 hover:text-white\" data-i18n=\"slots\">slot</a>\n        <a href=\"/casino/live\" class=\"block text-[13px] text-text3 hover:translate-x-0.5 hover:text-white\" data-i18n=\"liveCasino\">live casino</a>\n        <a href=\"/casino/shows\" class=\"block text-[13px] text-text3 hover:translate-x-0.5 hover:text-white\" data-i18n=\"gameShows\">game show</a>\n      </div>\n    </div>\n    <div>\n      <div class=\"mb-3 text-[13px] font-extrabold text-white\" data-i18n=\"support\">Customer Support</div>\n      <div class=\"space-y-2\">\n        <a href=\"/fairness\" class=\"block text-[13px] text-text3 hover:translate-x-0.5 hover:text-white\" data-i18n=\"fairness\">fairness</a>\n        <a href=\"/wallet\" class=\"block text-[13px] text-text3 hover:translate-x-0.5 hover:text-white\" data-i18n=\"wallet\">wallet</a>\n        <a href=\"/\" class=\"block text-[13px] text-text3 hover:translate-x-0.5 hover:text-white\" data-i18n=\"liveChat\">live chat</a>\n        <a href=\"/\" class=\"block text-[13px] text-text3 hover:translate-x-0.5 hover:text-white\" data-i18n=\"helpCenter\">help</a>\n      </div>\n    </div>\n    <div>\n      <div class=\"mb-3 text-[13px] font-extrabold text-white\" data-i18n=\"about\">introduction</div>\n      <div class=\"space-y-2\">\n        <a href=\"/\" class=\"block text-[13px] text-text3 hover:translate-x-0.5 hover:text-white\" data-i18n=\"responsibleGaming\">responsible game</a>\n        <a href=\"/\" class=\"block text-[13px] text-text3 hover:translate-x-0.5 hover:text-white\" data-i18n=\"privacy\">privacy policy</a>\n        <a href=\"/\" class=\"block text-[13px] text-text3 hover:translate-x-0.5 hover:text-white\" data-i18n=\"terms\">Terms of Use</a>\n      </div>\n    </div>\n    <div>\n      <div class=\"mb-3 text-[13px] font-extrabold text-white\" data-i18n=\"notice\">guide</div>\n      <div class=\"space-y-2\">\n        <a href=\"/\" class=\"block text-[13px] text-text3 hover:translate-x-0.5 hover:text-white\" data-i18n=\"internalSimulation\">Linbet</a>\n        <a href=\"/\" class=\"block text-[13px] text-text3 hover:translate-x-0.5 hover:text-white\" data-i18n=\"noCashValue\">USD wallet</a>\n        <a href=\"/wallet\" class=\"block text-[13px] text-text3 hover:translate-x-0.5 hover:text-white\" data-i18n=\"krwOnly\">USD exclusive</a>\n      </div>\n    </div>\n  </div>\n  <div class=\"mx-auto mt-8 flex max-w-[1280px] flex-wrap items-center justify-between gap-3 border-t border-border2 pt-5 text-[12px] text-text3\">\n    <span data-i18n=\"footerAge\">Age 18 or older. Play responsibly.</span>\n    <span data-i18n=\"footerCopy\" data-i18n-year=\"<%= year %>\">© <%= year %> Linbet · USD</span>\n  </div>\n</footer>\n\n            </div>\n          </main>\n        </div>\n        <aside id=\"chat-dock\" class=\"hidden w-[248px] shrink-0 flex-col border-l border-border2 bg-bg0 min-[1200px]:flex\">\n  <div class=\"flex h-16 items-center justify-between border-b border-border2 px-3\">\n    <span class=\"text-sm font-extrabold text-white\" data-i18n=\"chat\">chat</span>\n    <span id=\"chat-locale\" class=\"text-[11px] font-bold text-text3\">English</span>\n  </div>\n  <div id=\"chat-log\" class=\"flex-1 space-y-3 overflow-y-auto px-3 py-3\"></div>\n  <form id=\"chat-form\" class=\"flex gap-2 border-t border-border2 p-3\">\n    <input\n      id=\"chat-input\"\n      data-i18n-placeholder=\"loginToChat\"\n      placeholder=\"You can chat after logging in\"\n      class=\"h-10 min-w-0 flex-1 rounded-lg border border-border2 bg-bg3 px-3 text-sm text-white outline-none placeholder:text-text3 focus:border-success/40 disabled:opacity-50\"\n      disabled\n    />\n    <button\n      type=\"submit\"\n      class=\"h-10 rounded-lg bg-success px-3 text-[11px] font-extrabold text-text-button hover:brightness-110 disabled:opacity-40\"\n      data-i18n=\"send\"\n      disabled\n    >\n      send\n    </button>\n  </form>\n</aside>\n\n      </div>\n      <div id=\"wallet-modal\" class=\"fixed inset-0 z-50 hidden items-center justify-center p-4\">\n  <button type=\"button\" id=\"wallet-backdrop\" class=\"absolute inset-0 bg-black/70\" data-i18n-aria=\"close\" aria-label=\"close\"></button>\n  <div class=\"relative w-full max-w-2xl overflow-hidden rounded-xl bg-[#1f212e] shadow-[0_24px_80px_rgb(0_0_0/0.55)]\">\n    <div class=\"flex items-center justify-between px-5 pt-4 pb-1\">\n      <h3 class=\"text-[15px] font-extrabold text-white\" data-i18n=\"walletTitle\">wallet · USD</h3>\n      <button type=\"button\" id=\"wallet-close\" class=\"grid h-8 w-8 place-items-center rounded-md text-text3 hover:bg-[rgb(203_215_255/0.06)] hover:text-white\" data-i18n-aria=\"close\" aria-label=\"close\">\n        <svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M18 6 6 18M6 6l12 12\"/></svg>\n      </button>\n    </div>\n    <div class=\"p-5 pt-3\">\n      <div class=\"mb-4 flex items-center justify-between rounded-lg bg-bg2 px-4 py-3\">\n        <div>\n          <div class=\"text-[11px] font-bold tracking-wide text-text3 uppercase\" data-i18n=\"simulatedBalance\">holding balance</div>\n          <div id=\"modal-balance\" class=\"text-xl font-extrabold text-white\">$0</div>\n        </div>\n        <div class=\"text-right text-xs text-text3\">\n          <span id=\"deposited-today\"></span><br />\n          <span id=\"deposit-cap\"></span>\n        </div>\n      </div>\n      <div id=\"wallet-tabs\" class=\"mb-4 flex gap-1 rounded-lg bg-bg2 p-1\">\n        <button type=\"button\" data-wtab=\"deposit\" class=\"h-9 flex-1 rounded-md bg-bg5 text-sm font-bold text-white\" data-i18n=\"deposit\">deposit</button>\n        <button type=\"button\" data-wtab=\"withdraw\" class=\"h-9 flex-1 rounded-md text-sm font-bold text-text3 hover:text-white\" data-i18n=\"withdraw\">Withdrawal</button>\n        <button type=\"button\" data-wtab=\"history\" class=\"h-9 flex-1 rounded-md text-sm font-bold text-text3 hover:text-white\" data-i18n=\"history\">history</button>\n      </div>\n      <div id=\"wallet-history\" class=\"hidden max-h-[360px] space-y-2 overflow-y-auto\"></div>\n      <form id=\"wallet-form\" class=\"space-y-3\">\n        <p id=\"wallet-login-note\" class=\"hidden text-sm text-primary\" data-i18n=\"loginWallet\">Please log in to use your wallet.</p>\n        <p id=\"wallet-hint\" class=\"text-sm text-text3\" data-i18n=\"depositHint\">The deposited amount will be reflected in your USD wallet. Daily limits apply.</p>\n        <input id=\"wallet-amount\" type=\"number\" min=\"100\" value=\"100000\" class=\"h-12 w-full rounded-lg border border-border2 bg-bg2 px-3 text-lg font-bold text-white outline-none focus:border-success/40\" />\n        <div class=\"flex gap-2\">\n          <% [10000, 50000, 100000, 500000].forEach((v) => { %>\n            <button type=\"button\" data-amt=\"<%= v %>\" class=\"h-8 flex-1 rounded-md bg-bg5 text-xs font-bold text-text2 hover:text-white\"><%= v.toLocaleString(\"en-US\") %></button>\n          <% }) %>\n        </div>\n        <p id=\"wallet-error\" class=\"hidden text-sm text-danger\"></p>\n        <button id=\"wallet-submit\" type=\"submit\" class=\"inline-flex h-11 w-full items-center justify-center rounded-lg bg-success text-sm font-bold text-text-button disabled:opacity-40\" data-i18n=\"deposit\">deposit</button>\n      </form>\n    </div>\n  </div>\n</div>\n\n      <div id=\"login-modal\" class=\"fixed inset-0 z-50 hidden items-center justify-center p-4\">\n  <button type=\"button\" id=\"login-backdrop\" class=\"absolute inset-0 bg-black/70\" data-i18n-aria=\"close\" aria-label=\"close\"></button>\n  <div class=\"relative w-full max-w-[904px] overflow-hidden rounded-xl bg-[#1f212e] shadow-[0_24px_80px_rgb(0_0_0/0.55)]\">\n    <button type=\"button\" id=\"login-close\" class=\"absolute top-3 right-3 z-10 grid h-8 w-8 place-items-center rounded-md text-text3 hover:bg-[rgb(203_215_255/0.06)] hover:text-white\" data-i18n-aria=\"close\" aria-label=\"close\">\n      <svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M18 6 6 18M6 6l12 12\"/></svg>\n    </button>\n    <div class=\"grid min-h-[560px] md:grid-cols-[400px_1fr]\">\n      <form id=\"login-form\" class=\"flex flex-col px-7 py-6\">\n        <div class=\"mb-6 flex gap-2\">\n          <button type=\"button\" data-auth=\"login\" class=\"auth-tab h-9 rounded-md bg-[rgb(203_215_255/0.06)] px-3 text-[13px] font-extrabold tracking-[0.6px] text-white uppercase\" data-i18n=\"login\">log in</button>\n          <button type=\"button\" data-auth=\"join\" class=\"auth-tab h-9 rounded-md px-3 text-[13px] font-extrabold tracking-[0.6px] text-text3 uppercase\" data-i18n=\"joinNow\">Sign up</button>\n        </div>\n        <div class=\"space-y-4\">\n          <label id=\"field-nick\" class=\"hidden\">\n            <span class=\"mb-1.5 flex items-center gap-0.5 text-[11px] font-bold tracking-[0.08em] text-text2 uppercase\"><span data-i18n=\"username\">nickname</span><span class=\"text-danger\">*</span></span>\n            <input id=\"auth-nick\" autocomplete=\"username\" class=\"auth-input\" data-i18n-placeholder=\"username\" placeholder=\"nickname\" />\n            <span class=\"field-error mt-1 hidden text-[12px] font-medium text-danger\"></span>\n          </label>\n          <label class=\"block\">\n            <span class=\"mb-1.5 flex items-center gap-0.5 text-[11px] font-bold tracking-[0.08em] text-text2 uppercase\"><span data-i18n=\"email\">email</span><span class=\"text-danger\">*</span></span>\n            <input id=\"auth-email\" autocomplete=\"email\" inputmode=\"email\" placeholder=\"youremail@domain.com\" class=\"auth-input\" />\n            <span class=\"field-error mt-1 hidden text-[12px] font-medium text-danger\" data-for=\"email\"></span>\n          </label>\n          <label class=\"block\">\n            <span class=\"mb-1.5 flex items-center gap-0.5 text-[11px] font-bold tracking-[0.08em] text-text2 uppercase\"><span data-i18n=\"password\">password</span><span class=\"text-danger\">*</span></span>\n            <div class=\"relative\">\n              <input id=\"auth-password\" type=\"password\" autocomplete=\"current-password\" class=\"auth-input pr-11\" data-i18n-placeholder=\"password\" placeholder=\"password\" />\n              <button type=\"button\" id=\"toggle-password\" class=\"absolute top-1/2 right-3 -translate-y-1/2 text-text3 hover:text-white\" data-i18n-aria=\"showPassword\" aria-label=\"Show password\">\n                <svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z\"/><circle cx=\"12\" cy=\"12\" r=\"3\"/></svg>\n              </button>\n            </div>\n            <span class=\"field-error mt-1 hidden text-[12px] font-medium text-danger\" data-for=\"password\"></span>\n          </label>\n          <label id=\"field-confirm\" class=\"hidden\">\n            <span class=\"mb-1.5 flex items-center gap-0.5 text-[11px] font-bold tracking-[0.08em] text-text2 uppercase\"><span data-i18n=\"confirmPassword\">verify password</span><span class=\"text-danger\">*</span></span>\n            <input id=\"auth-confirm\" type=\"password\" autocomplete=\"new-password\" class=\"auth-input\" data-i18n-placeholder=\"confirmPassword\" placeholder=\"verify password\" />\n            <span class=\"field-error mt-1 hidden text-[12px] font-medium text-danger\" data-for=\"confirm\"></span>\n          </label>\n          <label id=\"field-invite\" class=\"hidden\">\n            <span class=\"mb-1.5 flex items-center gap-0.5 text-[11px] font-bold tracking-[0.08em] text-text2 uppercase\"><span data-i18n=\"inviteCode\">invitation code</span><span class=\"text-danger\">*</span></span>\n            <input id=\"auth-invite\" placeholder=\"501\" class=\"auth-input\" />\n            <span class=\"field-error mt-1 hidden text-[12px] font-medium text-danger\" data-for=\"invite\"></span>\n          </label>\n          <div id=\"field-agree\" class=\"hidden\">\n            <label class=\"flex items-start gap-2.5 text-[13px] text-text2\">\n              <input id=\"auth-agree\" type=\"checkbox\" class=\"mt-0.5 h-4 w-4 accent-success\" />\n              <span data-i18n=\"agreeTerms\">I have read and agree to the Terms of Use.</span>\n            </label>\n            <p class=\"field-error mt-1 hidden text-[12px] text-danger\" data-for=\"agree\"></p>\n          </div>\n          <p id=\"login-hint\" class=\"text-[12px] leading-5 text-text3\" data-i18n=\"loginHint\">Log in with your email and password.</p>\n          <p id=\"auth-error\" class=\"hidden text-[13px] font-medium text-danger\"></p>\n        </div>\n        <button id=\"auth-submit\" type=\"submit\" class=\"btn-juicy mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-juicy text-[14px] font-extrabold tracking-[0.5px] text-text-button uppercase disabled:opacity-40\" data-i18n=\"login\">log in</button>\n        <p class=\"mt-auto pt-6 text-[11px] leading-4 text-text3\" data-i18n=\"adminHint\">Operators use the administrator console on port 3001.</p>\n      </form>\n      <div class=\"auth-art relative hidden overflow-hidden md:block\">\n        <div class=\"absolute inset-0 flex flex-col items-center justify-center px-8 text-center\">\n          <img src=\"/brand/logo.svg\" alt=\"\" class=\"h-10 w-auto\" />\n          <span class=\"mt-2 text-[21px] font-black tracking-[0.05em] text-white\">LINBET</span>\n          <p class=\"mt-5 max-w-[240px] text-[13px] leading-5 text-white/80\" data-i18n=\"authArt\">USDPlay with.</p>\n          <p class=\"mt-8 text-[11px] tracking-[0.12em] text-white/45 uppercase\" data-i18n=\"agePlay\">18+ · play responsibly</p>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n\n      <div id=\"auth-progress\" class=\"auth-progress\" role=\"progressbar\" aria-label=\"loading\"></div>\n    </div>\n    <script src=\"https://cdn.socket.io/4.8.1/socket.io.min.js\"></script>\n    <script src=\"/js/app.js\"></script>\n    <% if (page === \"game\" && original) { %>\n      <script src=\"/js/originals.js\"></script>\n    <% } %>\n  </body>\n</html>\n";
const catalog = (() => {
const STAKE = [
  ["mines", "Mines", "Avoid mines, reveal tiles, cash out", "1%", "stake_mines.webp"],
  ["dice", "Dice", "Roll over or under the target", "1%", "stake_dice.webp"],
  ["blackjack", "Blackjack", "Beat the dealer to 21", "0.5%", "stake_blackjack.avif"],
  ["plinko", "Plinko", "Drop the ball into a multiplier bucket", "1%", "stake_plinko.webp"],
  ["limbo", "Limbo", "Set a target multiplier", "1%", "stake_limbo.avif"],
  ["keno", "Keno", "Pick numbers, match the draw", "1%", "stake_keno.avif"],
  ["crash", "Crash", "Cash out before the graph crashes", "1%", "stake_crash.webp"],
  ["chicken", "Chicken", "Cross the road and cash out", "1%", "stake_chicken.avif"],
  ["hilo", "HiLo", "Higher or lower", "1%", "stake_hilo.avif"],
  ["dragon-tower", "Dragon Tower", "Climb the tower", "1%", "stake_dragon-tower.avif"],
  ["moles", "Moles", "Whack the right moles", "1%", "stake_moles.avif"],
  ["slide", "Slide", "Cash out before the puck slides off", "1%", "stake_slide.avif"],
  ["flip", "Flip", "Heads or tails", "1%", "stake_flip.webp"],
  ["pump", "Pump", "Pump the balloon", "1%", "stake_pump.avif"],
  ["wheel", "Wheel", "Spin the multiplier wheel", "1%", "stake_wheel.avif"],
  ["snakes", "Snakes", "Dodge the snakes", "1%", "stake_snakes.avif"],
  ["roulette", "Roulette", "European 0–36 wheel", "2.7%", "stake_roulette.webp"],
  ["tome-of-life", "Tome of Life", "Open the tome", "1%", "stake_tome-of-life.avif"],
  ["baccarat", "Baccarat", "Player, banker, or tie", "1.06%", "stake_baccarat.avif"],
  ["rock-paper-scissors", "Rock Paper Scissors", "Classic RPS", "1%", "stake_rps.avif"],
  ["diamonds", "Diamonds", "Match gem colors", "1%", "stake_diamonds.avif"],
  ["packs", "Packs", "Open a pack", "1%", "stake_packs.avif"],
  ["darts", "Darts", "Hit the board", "1%", "stake_darts.avif"],
  ["drill", "Drill", "Drill for multipliers", "1%", "stake_drill.avif"],
  ["primedice", "Primedice", "Roll over or under", "1%", "stake_primedice.webp"],
  ["cases", "Cases", "Open a case", "1%", "stake_cases.avif"],
  ["scarab-spin", "Scarab Spin", "Spin the scarab", "1%", "stake_scarab-spin.avif"],
  ["video-poker", "Video Poker", "Jacks or better", "0.5%", "stake_video-poker.avif"],
  ["blue-samurai", "Blue Samurai", "Draw the blade", "1%", "stake_blue-samurai.avif"],
  ["tarot", "Tarot", "Reveal a card", "1%", "stake_tarot.avif"],
  ["bars", "Bars", "Hit the bars", "1%", "stake_bars.avif"],
];

const ORIGINAL_GAMES = STAKE.map(([slug, name, blurb, edge, image]) => ({
  slug,
  name,
  nameEn: name,
  blurb,
  edge,
  status: "live",
  image: `/assets/games/${image}`,
  provider: "Originals",
  kind: "original",
}));

const SLOT_ROWS = [
  ["pragmaticexternal_SweetBonanza.webp", "Sweet Bonanza", "Pragmatic Play"],
  ["pragmaticexternal_SweetRushBonanza.webp", "Sweet Rush Bonanza", "Pragmatic Play"],
  ["pragmaticexternal_StarlightPrincess1000.webp", "Starlight Princess 1000", "Pragmatic Play"],
  ["pragmaticexternal_BigBassSplash1000.webp", "Big Bass Splash 1000", "Pragmatic Play"],
  ["pragmaticexternal_WildWestGold.webp", "Wild West Gold", "Pragmatic Play"],
  ["pragmaticexternal_SugarRushSuperScatter.webp", "Sugar Rush Super Scatter", "Pragmatic Play"],
  ["pragmaticexternal_MoonRush.webp", "Moon Rush", "Pragmatic Play"],
  ["pragmaticexternal_GemsBonanza1.webp", "Gems Bonanza", "Pragmatic Play"],
  ["pragmaticexternal_ExtraJuicy.webp", "Extra Juicy", "Pragmatic Play"],
  ["pragmaticexternal_ChestsofCaiShen.webp", "Chests of Cai Shen", "Pragmatic Play"],
  ["hacksaw_LeBandit.webp", "Le Bandit", "Hacksaw"],
  ["hacksaw_LeZeus.webp", "Le Zeus", "Hacksaw"],
  ["hacksaw_LeDigger.webp", "Le Digger", "Hacksaw"],
  ["hacksaw_DeathBecomesYou.webp", "Death Becomes You", "Hacksaw"],
  ["hacksaw_ScarabAscension.webp", "Scarab Ascension", "Hacksaw"],
  ["hacksaw_FistofDestruction96.webp", "Fist of Destruction", "Hacksaw"],
  ["hacksaw_SpaceMutants.webp", "Space Mutants", "Hacksaw"],
  ["hacksaw_LeFishermanRollbit.webp", "Le Fisherman", "Hacksaw"],
  ["hacksaw_MarlinMastersTheBigHaul.webp", "Marlin Masters", "Hacksaw"],
  ["nolimit_FlightMode.webp", "Flight Mode", "Nolimit City"],
  ["nolimit_DuckHuntersHappyHour.webp", "Duck Hunters", "Nolimit City"],
  ["nolimit_LandOfTheFree.webp", "Land of the Free", "Nolimit City"],
  ["nolimit_GoldenShower.webp", "Golden Shower", "Nolimit City"],
  ["playngo_LegacyofDead.webp", "Legacy of Dead", "Play'n GO"],
  ["playngo_Reactoonz_desktop.webp", "Reactoonz", "Play'n GO"],
  ["playngo_TomeofMadness.webp", "Tome of Madness", "Play'n GO"],
  ["n2games_FilthyRich.webp", "Filthy Rich", "N2"],
  ["n2games_CandyQuake.webp", "Candy Quake", "N2"],
  ["pushgaming_JaguarDrop.webp", "Jaguar Drop", "Push Gaming"],
  ["peterandsons_CyberRunner.webp", "Cyber Runner", "Peter & Sons"],
  ["endorphina_endorphina2_MinotaurReBurn.webp", "Minotaur ReBurn", "Endorphina"],
  ["bgmng_JohnnyVsChicken.webp", "Johnny vs Chicken", "BG Gaming"],
  ["spnmnl_ThorsThunderStrike.webp", "Thor's Thunder Strike", "Spinomenal"],
];

const SLOT_GAMES = SLOT_ROWS.map(([file, name, provider]) => ({
  slug: file.replace(".webp", ""),
  name,
  nameEn: name,
  blurb: `${provider} slot · coming soon`,
  status: "soon",
  image: `/assets/games/${file}`,
  provider,
  kind: "slot",
}));

const LIVE_ROWS = [
  ["evolution_blackjack.webp", "Blackjack"],
  ["evolution_baccarat.webp", "Baccarat"],
  ["evolution_lightning_roulette.webp", "Lightning Roulette"],
  ["evolution_crazytime.webp", "Crazy Time"],
  ["evolution_monopoly.webp", "Monopoly"],
  ["evolution_FunkyTime.webp", "Funky Time"],
  ["evolution_lightning_baccarat.webp", "Lightning Baccarat"],
  ["evolution_craps.webp", "Craps"],
  ["evolution_dragon_tiger.webp", "Dragon Tiger"],
  ["evolution_LightningStorm.webp", "Lightning Storm"],
  ["evolution_casino_holdem.webp", "Casino Hold'em"],
  ["evolution_blackjack_vip_15.webp", "Blackjack VIP"],
  ["animo_CityRoulette.webp", "City Roulette"],
  ["animo_PortRoulette.webp", "Port Roulette"],
  ["pragmaticexternal_BlackjackLatino11.webp", "Blackjack Latino"],
];

const LIVE_GAMES = LIVE_ROWS.map(([file, name]) => ({
  slug: file.replace(".webp", ""),
  name,
  nameEn: name,
  blurb: "Live casino · coming soon",
  status: "soon",
  image: `/assets/games/${file}`,
  provider: file.startsWith("pragmatic") ? "Pragmatic Play" : file.startsWith("animo") ? "Animo" : "Evolution",
  kind: "live",
}));

const SHOW_GAMES = LIVE_GAMES.filter((g) => /crazy|monopoly|funky|lightning storm/i.test(g.name));
const ROULETTE_GAMES = LIVE_GAMES.filter((g) => /roulette/i.test(g.name));
const OTHER_SLOTS = SLOT_GAMES.filter((g) => g.provider !== "Pragmatic Play");

const PROVIDERS = [
  { name: "Pragmatic Play", src: "/assets/providers/pragmatic.svg" },
  { name: "Habanero", src: "/assets/providers/pragmatic.svg" },
  { name: "Evolution", src: "/assets/providers/evolution.svg" },
  { name: "Nolimit City", src: "/assets/providers/nolimit.svg" },
  { name: "Play'n GO", src: "/assets/providers/playngo.svg" },
  { name: "Hacksaw", src: "/assets/providers/hacksaw.svg" },
];

const SLOT_PAGE_SIZE = 24;
const SLOT_THUMB_W = 150;
const SLOT_GRID_GAP = 12;
const SLOT_PAGE_ROWS = 4;
const SLOT_PAGE_MAX = 120;

function playngoIconKey(name) {
  const words = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .split(/[^0-9A-Za-z]+/)
    .filter(Boolean);
  return words
    .map((word, index) => {
      if (index > 0 && /^(of|and|the|a)$/i.test(word)) return word.toLowerCase();
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join("");
}

function mapApiGame(g) {
  const p = (g.providerCode || "").toUpperCase();
  const pragmatic = p === "PRAGMATICPLAY" || p === "PRAGMATIC" || g.kind === "PRAGMATIC";
  const habanero = p === "HABANERO" || g.kind === "HABANERO";
  const playngo = p === "PLAYNGO" || g.kind === "PLAYNGO";
  const hacksaw = p === "HACKSAW" || g.kind === "HACKSAW";
  const genericSlot = g.kind === "SLOT";
  const slot = pragmatic || habanero || playngo || hacksaw || genericSlot;
  const symbol = g.gameCode || g.providerGameId || undefined;
  return {
    slug: g.slug,
    name: g.name,
    nameEn: g.nameEn || g.name,
    blurb: g.blurb,
    status: g.status === "LIVE" || g.status === "live" ? "live" : "soon",
    image:
      g.image ||
      (pragmatic && symbol
        ? `https://common-static.ppgames.net/game_pic/square/200/${symbol}.png`
        : habanero && symbol
          ? `https://app-b.insvr.com/img/rect/300/${symbol}.png`
          : playngo
            ? `https://cdn.softswiss.net/i/s3/playngo/${encodeURIComponent(playngoIconKey(g.name))}.png`
            : hacksaw
              ? `https://cdn.softswiss.net/i/s3/hacksaw/${encodeURIComponent(playngoIconKey(g.name))}.png`
              : "/assets/providers/pragmatic.svg"),
    provider: g.provider,
    kind: pragmatic ? "pragmatic" : habanero ? "habanero" : playngo ? "playngo" : hacksaw ? "hacksaw" : genericSlot ? "slot" : "original",
    demo: slot,
    providerGameId: symbol,
    providerCode: g.providerCode,
    gameCode: symbol,
  };
}

function findPlayable(slug) {
  return ORIGINAL_GAMES.find((g) => g.slug === slug);
}

function thumbForGame(name) {
  const n = String(name || "").toLowerCase();
  const hit = ORIGINAL_GAMES.find(
    (g) => n.includes(g.slug.replace(/-/g, " ")) || n.includes(g.name.toLowerCase()),
  );
  return hit?.image ?? "/assets/games/stake_dice.webp";
}

function slotColumnCount(width) {
  if (!Number.isFinite(width) || width <= 0) return 1;
  return Math.max(1, Math.floor((width + SLOT_GRID_GAP) / (SLOT_THUMB_W + SLOT_GRID_GAP)));
}

function slotPageSize(columns) {
  const cols = Math.max(1, Math.floor(columns) || 1);
  const rows = Math.max(1, Math.min(SLOT_PAGE_ROWS, Math.floor(SLOT_PAGE_MAX / cols)));
  return cols * rows;
}

return {
  ORIGINAL_GAMES,
  SLOT_GAMES,
  LIVE_GAMES,
  SHOW_GAMES,
  ROULETTE_GAMES,
  OTHER_SLOTS,
  PROVIDERS,
  SLOT_PAGE_SIZE,
  mapApiGame,
  findPlayable,
  thumbForGame,
  slotColumnCount,
  slotPageSize,
};
})();

const PORT = Number(process.env.PORT || 3000);
const API_ORIGIN = process.env.API_ORIGIN || "http://localhost:4000";

const app = express();
app.disable("x-powered-by");

const apiProxy = createProxyMiddleware({
  target: API_ORIGIN,
  changeOrigin: true,
  pathFilter: "/api",
});
const socketProxy = createProxyMiddleware({
  target: API_ORIGIN,
  changeOrigin: true,
  ws: true,
  pathFilter: "/socket.io",
});
app.use(apiProxy);
app.use(socketProxy);

app.use(express.static(path.join(__dirname, "public")));

function shell(res, page, extra = {}) {
  res.type("html").send(ejs.render(SITE, {
    page,
    path: extra.path || "/",
    year: new Date().getFullYear(),
    ...extra,
  }));
}

async function hubLobby() {
  const fallbackSlots = catalog.SLOT_GAMES.filter((g) => g.provider === "Pragmatic Play");
  const fallbackProviders = catalog.PROVIDERS;
  try {
    const indexUrl = `${API_ORIGIN}/api/games?kinds=SLOT&status=LIVE&take=1&skip=0`;
    const indexRes = await fetch(indexUrl, { signal: AbortSignal.timeout(8000) });
    if (!indexRes.ok) {
      return { slots: [...fallbackSlots, ...catalog.OTHER_SLOTS], providers: fallbackProviders };
    }
    const index = await indexRes.json();
    const names = index.providers || [];
    const pages = await Promise.all(
      names.map(async (name) => {
        const params = new URLSearchParams({
          kinds: "SLOT",
          status: "LIVE",
          sort: "az",
          take: "1",
          skip: "0",
          provider: name,
        });
        const res = await fetch(`${API_ORIGIN}/api/games?${params}`, { signal: AbortSignal.timeout(8000) });
        if (!res.ok) return [];
        const page = await res.json();
        return (page.items || []).map(catalog.mapApiGame).filter((g) => g.status === "live");
      }),
    );
    const slots = pages.flat();
    return {
      slots: slots.length ? slots : [...fallbackSlots, ...catalog.OTHER_SLOTS],
      providers: names.length ? names.map((name) => ({ name })) : fallbackProviders,
    };
  } catch {
    return { slots: [...fallbackSlots, ...catalog.OTHER_SLOTS], providers: fallbackProviders };
  }
}

app.get(["/", "/casino"], async (req, res, next) => {
  try {
    const lobby = await hubLobby();
    shell(res, "browse", {
      path: req.path === "/casino" ? "/casino" : "/",
      active: "lobby",
      mode: "lobby",
      originals: catalog.ORIGINAL_GAMES,
      slots: lobby.slots.slice(0, 24),
      live: catalog.LIVE_GAMES,
      providers: lobby.providers,
      searchKey: "searchLobby",
    });
  } catch (err) {
    next(err);
  }
});

function staticBrowse(pathName, active, games, searchKey) {
  return (req, res) => {
    const names = ["All", ...new Set(games.map((g) => g.provider))];
    shell(res, "browse", {
      path: pathName,
      active,
      mode: "grid",
      games,
      providers: names,
      searchKey,
    });
  };
}

app.get("/casino/originals", staticBrowse("/casino/originals", "linbet", catalog.ORIGINAL_GAMES, "searchLinbet"));
app.get("/casino/live", staticBrowse("/casino/live", "live", catalog.LIVE_GAMES, "searchLive"));
app.get("/casino/shows", staticBrowse("/casino/shows", "shows", catalog.SHOW_GAMES, "searchShows"));
app.get("/casino/roulette", staticBrowse("/casino/roulette", "roulette", catalog.ROULETTE_GAMES, "searchRoulette"));

app.get("/casino/slots", (req, res) => {
  shell(res, "browse", {
    path: "/casino/slots",
    active: "slots",
    mode: "paged",
    games: [],
    providers: ["All"],
    searchKey: "searchSlots",
  });
});

app.get("/wallet", (req, res) => {
  shell(res, "wallet", { path: "/wallet" });
});

app.get("/fairness", (req, res) => {
  shell(res, "fairness", { path: "/fairness" });
});

app.get("/games/:slug", async (req, res, next) => {
  try {
    const slug = req.params.slug;
    const original = catalog.findPlayable(slug);
    let remote = null;
    if (!original) {
      try {
        const apiRes = await fetch(`${API_ORIGIN}/api/games/${encodeURIComponent(slug)}`, {
          signal: AbortSignal.timeout(2500),
        });
        if (apiRes.ok) remote = catalog.mapApiGame(await apiRes.json());
      } catch {
        remote = null;
      }
    }
    const game = original || remote;
    const more = catalog.ORIGINAL_GAMES.filter((g) => g.slug !== slug).slice(0, 8);
    const slot =
      game &&
      game.status === "live" &&
      game.kind &&
      game.kind !== "original" &&
      game.kind !== "live";
    shell(res, "game", {
      path: `/games/${slug}`,
      slug,
      game,
      original: Boolean(original && original.status === "live"),
      slot: Boolean(slot),
      mode: req.query.mode === "demo" || req.query.mode === "real" ? req.query.mode : "",
      more,
    });
  } catch (err) {
    next(err);
  }
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).send("Server error");
});

const server = app.listen(PORT, () => {
  console.log(`Linbet EJS  http://localhost:${PORT}`);
  console.log(`API proxy   ${API_ORIGIN}`);
});

server.on("upgrade", socketProxy.upgrade);
