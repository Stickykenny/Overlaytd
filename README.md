# [Overlaytd](https://stkykenny.github.io/Overlaytd/)

CHECK IT OUT HERE : [Overlaytd Preview](https://stkykenny.github.io/Overlaytd/)
User Interface for [Relaytd](https://github.com/Stkykenny/Relaytd)

## List of features implemented

<details>
<summary><b>Global : </b></summary>

- Left navigation sidebar
- Info dialog / page description top-right
- Notifications w/ ngx-toastr
- Floating windows / Media-dock for additional usage (Youtube playlist, and possibly RSS implementation)
- [PROD] Login page is blocked due to the lack of backend server, small wave animation of the warn text
- HttpInterceptorFn : Intercept call to API and retry in case of JWT expired
- Offline Database using IndexedDB/Dexie.js. **Currently only tested for logic with the Grid and display with the Tree**
- ~~NgRx-store : old implementation unused due to being too overcomplicated for current need~~

</details>

<details>
<summary><b>Tree (D3.js) : </b></summary>

- Radial tree
- Slider for tree rotation, coupled with Sfx pitch changes for cranking sounds (using Tone.js)
- Node on hover display a tooltip
- Tooltip gets pinned on click and display buttons for additional logics
- On node hover ancestry branch transition to rainbow

</details>

<details>
<summary><b>Grid : </b></summary>

- Add/Delete
- Quick Search in grid
- Import/Export data
- QoL (condition check, new row with default input)
- Confirmation dialog on import to allow overwrite/append/cancel

</details>

## Preview

##### Radial Tree View

| Radial tree layout                                                                                                                 | Node on mouse-over                                                                                                                                  |
| ---------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| <img src="./.github/preview/radial_tree_preview_1.png" alt="Tree page preview" title="Tree page preview (yes this is censored)" /> | <img src="./.github/preview/radial_tree_hover_preview_1.png" alt="Tree page preview" title="Tree page preview (yes this is censored)" width="900"/> |

| Login page                                                                                                                                            | Navbar Animation                                                                                                                          |
| ----------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| <img src="./.github/preview/overlaytd_login_preview_1.jpg" alt="Login Page with Toastr Notification preview" title="Login Page preview" width="400"/> | <img src="./.github/preview/overlaytd_navbar_preview_1.gif" alt="Navbar animation preview" title="Navbar animation preview" width="400"/> |

##### Main editor tab - Grid

<img src="./.github/preview/overlaytd_grid_preview_1.jpg" alt="Grid page preview" title="Grid page preview" width="700"/>

##### Shenanigans (unwanted features that appeared in development)

Raindow path with infinite loop
<img src="./.github/preview/rainbow_path_loop.gif" alt="Rainbow path loop stuck preview" title="Rainbow path loop stuck preview" width="700"/>
