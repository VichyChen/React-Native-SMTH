/**
 * @providesModule CommonCSS
 */

var CommonCSS = {
    get listName() {
        return {
            fontSize: global.configures.fontSize15,
            color: global.colors.fontColor
        }
    },
    get listMeta() {
        return {
            fontSize: global.configures.fontSize13,
            color: global.colors.gray1Color
        }
    },
    get listHost() {
        return {
            marginLeft: 6,
            paddingLeft: 3,
            paddingRight: 3,
            paddingTop: 3,
            paddingBottom: 2,
            fontSize: global.configures.fontSize10,
            color: global.colors.redColor,
            borderColor: global.colors.redColor,
            borderWidth: 1,
            borderRadius: 2,
            textAlign: 'center'
        }
    },
    get threadTitle() {
        return {
            lineHeight: global.constants.LineHeight,
            fontSize: global.configures.fontSize18,
            fontWeight: '600',
            color: global.colors.fontColor,
        }
    },
    get listTitle() {
        return {
            lineHeight: global.constants.LineHeight,
            fontSize: global.configures.fontSize17,
            fontWeight: '600',
            color: global.colors.fontColor,
        }
    },
    get listOnlyTitle() {
        return {
            lineHeight: global.constants.LineHeight,
            fontSize: global.configures.fontSize17,
            color: global.colors.fontColor,
        }
    },
    get listContent() {
        return {
            lineHeight: global.constants.LineHeight,
            fontSize: global.configures.fontSize14,
            color: global.colors.fontColor,
        }
    },
    get listTime() {
        return {
            fontSize: global.configures.fontSize13,
            color: global.colors.gray2Color
        }
    },
    get listBoardEN() {
        return {
            paddingTop: 1,
            paddingLeft: 4,
            paddingRight: 4,
            fontSize: global.configures.fontSize13,
            color: global.colors.redColor,
            borderColor: global.colors.redColor,
            borderWidth: 1,
            borderRadius: 2,
            height: 20,
            textAlign: 'center',
            alignItems: 'center',
        }
    },
    get listBoardCH() {
        return {
            paddingTop: 3,
            paddingLeft: 4,
            paddingRight: 4,
            fontSize: global.configures.fontSize13,
            color: global.colors.redColor,
            borderColor: global.colors.redColor,
            borderWidth: 1,
            borderRadius: 2,
            height: 20,
            textAlign: 'center',
            alignItems: 'center',
        }
    },
    get listDescript() {
        return {
            fontSize: global.configures.fontSize13,
            color: global.colors.gray2Color
        }
    },

    get content() {
        return {
            lineHeight: global.constants.LineHeight,
            fontSize: global.configures.fontSize17,
            color: global.colors.fontColor,
        }
    },

    get itemBoard() {
        return {
            height: 30,
            marginRight: 10,
            marginTop: 10,
            paddingTop: 7,
            paddingLeft: 10,
            paddingRight: 10,
            backgroundColor: global.colors.whiteColor,
            borderColor: '#EBEBEB',
            borderWidth: 1,
            borderRadius: 4,
            fontSize: global.configures.fontSize15,
            color: global.colors.fontColor,
        }
    },

    get sectionView() {
        return {
            height: 40,
            flexDirection: 'row',
            alignItems: 'center',
            paddingLeft: global.constants.Padding,
            backgroundColor: global.colors.whiteColor,
        }
    },
    get sectionVerticalLine() {
        return {
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 3,
            backgroundColor: global.colors.clearColor,
        }
    },
    get sectionTitle() {
        return {
            fontSize: global.configures.fontSize16,
            fontWeight: '600',
            color: global.colors.fontColor
        }
    },
}

export {
    CommonCSS
}