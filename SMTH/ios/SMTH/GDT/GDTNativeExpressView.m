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

@property (strong, nonatomic) GDTNativeExpressAdView *expressView;

@end

@implementation GDTNativeExpressView

- (instancetype)init {
  if (self = [super init]) {
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(renderSuccessAction:) name:@"GDTNativeExpressViewRenderSuccessNotification" object:nil];
  }
  return self;
}

- (void)dealloc {
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (void)renderSuccessAction:(NSNotification *)notification {
  if (((NSNumber *)[notification object]).intValue == self.adTag) {
    if (self.onRenderSuccess) {
      self.onRenderSuccess(@{@"height": @(self.expressView.bounds.size.height)});
    }
  }
}

- (void)setAdTag:(int)adTag {
  _adTag = adTag;
}

- (void)setOnRenderSuccess:(RCTBubblingEventBlock)onRenderSuccess {
    _onRenderSuccess = onRenderSuccess;
  
  self.expressView = [APP.nativeExpressAdManager getAd:self.adTag];
  self.expressView.frame = CGRectMake(0, 0, ScreenWidth, self.expressView.bounds.size.height);
  [self addSubview:self.expressView];

  if (self.expressView.isReady) {
    if (self.onRenderSuccess) {
      self.onRenderSuccess(@{@"height": @(self.expressView.bounds.size.height)});
    }
  }
}

@end
