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

- (void)setIndex:(int)index {
  _index = index;
  self.expressView = [((AppDelegate *)[UIApplication sharedApplication].delegate).expressAdViews objectAtIndex:index];
  self.expressView.frame = CGRectMake(0, 0, ScreenWidth, self.expressView.bounds.size.height);
  [self addSubview:self.expressView];
  
//    NSLayoutConstraint *leftConstraint = [NSLayoutConstraint constraintWithItem:self.expressView attribute:(NSLayoutAttributeLeft) relatedBy:(NSLayoutRelationEqual) toItem:self attribute:(NSLayoutAttributeLeft) multiplier:1.0 constant:0];
//    NSLayoutConstraint *topConstraint = [NSLayoutConstraint constraintWithItem:self.expressView attribute:(NSLayoutAttributeTop) relatedBy:(NSLayoutRelationEqual) toItem:self attribute:(NSLayoutAttributeTop) multiplier:1.0 constant:0];
//    NSLayoutConstraint *bottomConstraint = [NSLayoutConstraint constraintWithItem:self.expressView attribute:(NSLayoutAttributeHeight) relatedBy:(NSLayoutRelationEqual) toItem:self attribute:(NSLayoutAttributeHeight) multiplier:1.0 constant:0];
//    NSLayoutConstraint *rightConstraint = [NSLayoutConstraint constraintWithItem:self.expressView attribute:(NSLayoutAttributeWidth) relatedBy:(NSLayoutRelationEqual) toItem:self attribute:(NSLayoutAttributeWidth) multiplier:1.0 constant:0];
//
//    [self addConstraint:leftConstraint];
//    [self addConstraint:rightConstraint];
//    [self addConstraint:topConstraint];
//    [self addConstraint:bottomConstraint];
}

- (void)setOnReceived:(RCTBubblingEventBlock)onReceived {
    _onReceived = onReceived;
}

- (void)layoutSubviews {
  [super layoutSubviews];
  
  if (UI_USER_INTERFACE_IDIOM() == UIUserInterfaceIdiomPhone && self.expressView.bounds.size.height > 500) {
      return;
  }
  if (self.onReceived) {
      self.onReceived(@{@"height": @(self.expressView.bounds.size.height)});
  }
}

@end
