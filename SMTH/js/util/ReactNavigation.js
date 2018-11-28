import uuid from 'uuid';

export default class ReactNavigation {
    static navigate(navigation, routeName, params) {
        navigation.navigate({ routeName: routeName, params: params, key: uuid.v4() })
    }
}