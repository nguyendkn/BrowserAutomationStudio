/****************************************************************************
 **
 ** Copyright (C) 2013 Digia Plc and/or its subsidiary(-ies).
 ** Contact: http://www.qt-project.org/legal
 **
 ** This file is part of the examples of the Qt Toolkit.
 **
 ** $QT_BEGIN_LICENSE:BSD$
 ** You may use this file under the terms of the BSD license as follows:
 **
 ** "Redistribution and use in source and binary forms, with or without
 ** modification, are permitted provided that the following conditions are
 ** met:
 **   * Redistributions of source code must retain the above copyright
 **     notice, this list of conditions and the following disclaimer.
 **   * Redistributions in binary form must reproduce the above copyright
 **     notice, this list of conditions and the following disclaimer in
 **     the documentation and/or other materials provided with the
 **     distribution.
 **   * Neither the name of Digia Plc and its Subsidiary(-ies) nor the names
 **     of its contributors may be used to endorse or promote products derived
 **     from this software without specific prior written permission.
 **
 **
 ** THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 ** "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 ** LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 ** A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 ** OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 ** SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 ** LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 ** DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 ** THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 ** (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 ** OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE."
 **
 ** $QT_END_LICENSE$
 **
 ****************************************************************************/

 #include <QtGui>
 #include <QWidget>

 #include "flowlayout.h"
 #include "every_cpp.h"
 FlowLayout::FlowLayout(QWidget *parent, int margin, int hSpacing, int vSpacing)
     : QLayout(parent), m_hSpace(hSpacing), m_vSpace(vSpacing)
 {
     setContentsMargins(margin, margin, margin, margin);
 }

 FlowLayout::FlowLayout(int margin, int hSpacing, int vSpacing)
     : m_hSpace(hSpacing), m_vSpace(vSpacing)
 {
     setContentsMargins(margin, margin, margin, margin);
 }

 FlowLayout::~FlowLayout()
 {
     QLayoutItem *item;
     while ((item = takeAt(0)))
         delete item;
 }

 void FlowLayout::addItem(QLayoutItem *item)
 {
     itemList.append(item);
 }

 void FlowLayout::swapItems(int index1, int index2)
 {
     if(index1 >= 0 && index1 < itemList.length() && index2 >= 0 && index2 < itemList.length() )
        itemList.swap(index1,index2);
 }

 int FlowLayout::horizontalSpacing() const
 {
     if (m_hSpace >= 0) {
         return m_hSpace;
     } else {
         return smartSpacing(QStyle::PM_LayoutHorizontalSpacing);
     }
 }

 int FlowLayout::verticalSpacing() const
 {
     if (m_vSpace >= 0) {
         return m_vSpace;
     } else {
         return smartSpacing(QStyle::PM_LayoutVerticalSpacing);
     }
 }

 int FlowLayout::count() const
 {
     return itemList.size();
 }

 QLayoutItem *FlowLayout::itemAt(int index) const
 {
     return itemList.value(index);
 }

 QLayoutItem *FlowLayout::takeAt(int index)
 {
     if (index >= 0 && index < itemList.size())
         return itemList.takeAt(index);
     else
         return 0;
 }

 void FlowLayout::insertAt(QLayoutItem * item, int index)
 {
     itemList.insert(index, item);
 }

 Qt::Orientations FlowLayout::expandingDirections() const
 {
     return 0;
 }

 bool FlowLayout::hasHeightForWidth() const
 {
     return true;
 }

 int FlowLayout::heightForWidth(int width) const
 {
     int height = doLayout(QRect(0, 0, width, 0), true);
     return height;
 }

 void FlowLayout::setGeometry(const QRect &rect)
 {
     QLayout::setGeometry(rect);
     doLayout(rect, false);
 }

 QSize FlowLayout::sizeHint() const
 {
     return minimumSize();
 }

 QSize FlowLayout::minimumSize() const
 {
     QSize size;
     QLayoutItem *item;
     foreach (item, itemList)
         size = size.expandedTo(item->minimumSize());

     size += QSize(2*margin(), 2*margin());
     return size;
 }

 int FlowLayout::doLayout(const QRect &rect, bool testOnly) const
 {
     int left, top, right, bottom;
     getContentsMargins(&left, &top, &right, &bottom);
     QRect effectiveRect = rect.adjusted(+left, +top, -right, -bottom);
     int x = effectiveRect.x();
     int y = effectiveRect.y();
     int lineHeight = 0;

     QLayoutItem *item;
     foreach (item, itemList) {
         QWidget *wid = item->widget();
         int spaceX = horizontalSpacing();
         if (spaceX == -1)
             spaceX = wid->style()->layoutSpacing(
                 QSizePolicy::PushButton, QSizePolicy::PushButton, Qt::Horizontal);
         int spaceY = verticalSpacing();
         if (spaceY == -1)
             spaceY = wid->style()->layoutSpacing(
                 QSizePolicy::PushButton, QSizePolicy::PushButton, Qt::Vertical);
         int nextX = x + item->sizeHint().width() + spaceX;
         if (nextX - spaceX > effectiveRect.right() && lineHeight > 0) {
             x = effectiveRect.x();
             y = y + lineHeight + spaceY;
             nextX = x + item->sizeHint().width() + spaceX;
             lineHeight = 0;
         }

         if (!testOnly)
             item->setGeometry(QRect(QPoint(x, y), item->sizeHint()));

         x = nextX;
         lineHeight = qMax(lineHeight, item->sizeHint().height());
     }
     return y + lineHeight - rect.y() + bottom;
 }
 int FlowLayout::smartSpacing(QStyle::PixelMetric pm) const
 {
     QObject *parent = this->parent();
     if (!parent) {
         return -1;
     } else if (parent->isWidgetType()) {
         QWidget *pw = static_cast<QWidget *>(parent);
         return pw->style()->pixelMetric(pm, 0, pw);
     } else {
         return static_cast<QLayout *>(parent)->spacing();
     }
 }

 void FlowLayout::moveItemDown(int index)
 {
     swapItems(index,index + 1);
     update();
 }
 void FlowLayout::moveItemUp(int index)
 {
    swapItems(index,index - 1);
    update();
 }
