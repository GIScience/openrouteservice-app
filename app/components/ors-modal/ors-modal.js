angular.module('orsApp.ors-modal', []).component('orsModal', {
    template: `
			<div class="ors-modal-container">
				<ng-transclude></ng-transclude>
			    <button class="ors-modal-close" data-ng-click="$ctrl.showFn()" style='background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBmaWxsPSIjMGYzNDc4IiBkPSJNOS43MDMgOGw0LjA4Ny00LjA4NmEuNzI2LjcyNiAwIDAgMCAwLTEuMDIxbC0uNjgzLS42ODNhLjcyNC43MjQgMCAwIDAtMS4wMjEgMEw4IDYuMjk4IDMuOTEyIDIuMjFhLjcyMi43MjIgMCAwIDAtMS4wMiAwbC0uNjgyLjY4MmEuNzI0LjcyNCAwIDAgMCAwIDEuMDIxTDYuMjk2IDggMi4yMSAxMi4wODZhLjcyNC43MjQgMCAwIDAgMCAxLjAyMWwuNjgyLjY4MmEuNzIyLjcyMiAwIDAgMCAxLjAyIDBMOCA5LjcwMWw0LjA4NyA0LjA4OGEuNzI0LjcyNCAwIDAgMCAxLjAyMSAwbC42ODMtLjY4MmEuNzI2LjcyNiAwIDAgMCAwLTEuMDIxTDkuNzAzIDh6Ii8+PC9zdmc+");'>
			    close
			    </button>  
			</div>
    `,
    transclude: true,
    bindings: {
        showFn: '&',
    },
    controller() {
        let ctrl = this;
    }
});


