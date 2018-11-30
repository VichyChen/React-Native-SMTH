//
//  GDTNativeExpressView.m
//  SMTH
//
//  Created by 陈大捷 on 2018/11/29.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "GDTNativeExpressView.h"
#import "AppDelegate.h"

@interface GDTNativeExpressView()

@property (strong, nonatomic) UIView *expressView;

@end

@implementation GDTNativeExpressView

- (instancetype)init {
  if (self = [super init]) {

  }
  return self;
}

- (void)setAdTag:(int)adTag {
  _adTag = adTag;
}

- (void)setOnReceived:(RCTBubblingEventBlock)onReceived {
    _onReceived = onReceived;
  
  self.expressView = [APP.nativeExpressAdManager getAd:self.adTag];
  self.expressView.frame = CGRectMake(0, 0, ScreenWidth, self.expressView.bounds.size.height);
  [self addSubview:self.expressView];

  if (self.onReceived) {
    self.onReceived(@{@"height": @(self.expressView.bounds.size.height)});
  }
}

@end
