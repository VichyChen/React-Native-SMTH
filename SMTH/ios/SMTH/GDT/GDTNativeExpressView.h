//
//  GDTNativeExpressView.h
//  SMTH
//
//  Created by 陈大捷 on 2018/11/29.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <React/RCTViewManager.h>

@interface GDTNativeExpressView : UIView

@property (nonatomic, assign) int adTag;
@property (nonatomic, copy) RCTBubblingEventBlock onRenderSuccess;

@end
