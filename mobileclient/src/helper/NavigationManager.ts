import {
  CommonActions,
  NavigationContainerRef,
  StackActions,
} from '@react-navigation/native';

const NavigationManager = {
  navigator: null as NavigationContainerRef<{}> | null,

  /**
   * Set To navigation when app starts
   * @param navigatorRef : refere from starting point of App
   */
  setTopLevelNavigator(navigatorRef: NavigationContainerRef<{}> | null) {
    this.navigator = navigatorRef;
  },

  /**
   * Navigate to next screen
   * @param routeName : screen name to navigate
   * @param params : if any params required for that screen
   */
  navigate(routeName: any, params?: any) {
    this.navigator!.dispatch(
      CommonActions.navigate({
        name: routeName,
        params: params,
      }),
    );
  },

  /**
   * Navigate to specific screen by clearing stack
   * @param routeName : screen name to navigate
   * @param params : if any params required for that screen
   */
  navigateAndClear(routeName: any, params?: any) {
    this.navigator!.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: routeName,
            params: params,
          },
        ],
      }),
    );
  },

  /**
   * Check if navigation can go back
   * @returns boolean indicating if going back is possible
   */
  canGoBack(): boolean {
    return this.navigator?.canGoBack() || false;
  },

  /**
   * Navigate back to previous screen
   */
  goBack() {
    this.navigator!.dispatch(CommonActions.goBack());
  },

  /**
   * Navigate to a specific screen in a nested navigator
   * @param routeName Screen name
   * @param params Screen parameters
   * @param parentNavigator Name of the parent navigator (optional)
   */
  navigateNested(routeName: any, params?: any, parentNavigator?: string) {
    this.navigator!.dispatch(
      CommonActions.navigate({
        name: parentNavigator || routeName,
        params: parentNavigator ? {screen: routeName, params} : params,
      }),
    );
  },

  /**
   * Get the current route name
   * @returns Current route name or null if not available
   */
  getCurrentRoute(): string | null {
    const currentRoute = this.navigator?.getCurrentRoute();
    return currentRoute?.name || null;
  },

  /**
   * Push a new screen onto the stack (useful for stack navigators)
   * @param routeName Screen name
   * @param params Screen parameters
   */
  push(routeName: any, params?: any) {
    this.navigator!.dispatch(StackActions.push(routeName, params));
  },

  /**
   * Remove the screen using index and move to next screen
   * @param routeName
   * @param removeScreenIndex
   */
  navigatePop(routeName: any, removeScreenIndex: number) {
    this.navigator!.dispatch(StackActions.pop(removeScreenIndex));
    this.navigate(routeName);
  },

  /**
   * To replace current screen form the next screen, after using this previous screen will not be present in stack
   * @param routeName Screen name
   */
  navigateAndReplace(routeName: any, params?: any) {
    this.navigator!.dispatch(StackActions.replace(routeName, params));
  },

  /**
   * To pop to the screen
   * @param count
   */
  pop(count: number) {
    this.navigator!.dispatch(StackActions.pop(count));
  },
};

export default NavigationManager;
